import crypto from 'crypto';
import ipaddr from 'ipaddr.js';
import { lookup } from 'geoip-lite';
import redisClient, { RedisClient } from '../config/redis';
import logger from '../utils/logger';

import {Fingerprint} from '../utils/Fingerprint';

const REFRESH_EXPIRE_SECONDS = 15 * 60;

/**
 * Service for managing Refresh Tokens via Redis.
 */
export class RefreshService {
    private static client: RedisClient | undefined;

    static async init(): Promise<void> {
        RefreshService.client = await redisClient;
    }

    static async save(uuid: string, token: string, sessionId: string, ip?: string, ua?: string): Promise<void> {
        const key = `refresh_token:${uuid}:${sessionId}`;
        const fingerprint = new Fingerprint(ip || '0.0.0.0', ua || '');
        const payload = { token, fingerprint };
        await RefreshService.client?.setex(key, REFRESH_EXPIRE_SECONDS, JSON.stringify(payload));
    }

    static async isValid(uuid: string, token: string, sessionId: string, ip?: string, ua?: string): Promise<boolean> {
        if (!sessionId) return false;
        const key = `refresh_token:${uuid}:${sessionId}`;
        const storedRaw = await RefreshService.client?.get(key);
        if (!storedRaw) return false;

        try {
            const { token: storedToken, fingerprint } = JSON.parse(storedRaw);
            if (storedToken !== token) return false;
            if (!fingerprint) return false;

            return new Fingerprint(fingerprint).equals(new Fingerprint(ip || '0.0.0.0', ua || ''));
        } catch (err) {
            logger.error('RefreshService.isValid parse error:', err);
            return false;
        }
    }

    static async revoke(uuid: string, sessionId?: string, ip?: string, ua?: string): Promise<void> {
        if (sessionId) {
            const key = `refresh_token:${uuid}:${sessionId}`;
            await RefreshService.client?.del(key);
            return;
        }

        const stream = RefreshService.client?.scanStream({ match: `refresh_token:${uuid}:*` });
        const keysToDelete: string[] = [];

        return new Promise((resolve, reject) => {
            stream?.on('data', (keys: string[]) => {
                if (keys.length) keysToDelete.push(...keys);
            });

            stream?.on('end', async () => {
                try {
                    if (keysToDelete.length) await RefreshService.client?.del(...keysToDelete);
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });

            stream?.on('error', (err: unknown) => reject(err));
        });
    }
}
