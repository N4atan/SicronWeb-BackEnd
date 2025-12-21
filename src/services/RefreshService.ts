import crypto from 'crypto';
import ipaddr from 'ipaddr.js';
import { lookup } from 'geoip-lite';
import redisClient, { RedisClient } from '../config/redis';
import logger from '../utils/logger';

import {Fingerprint} from '../utils/Fingerprint';
import {TOKEN_EXPIRATION} from '../config/cookies';

const REFRESH_EXPIRE_SECONDS = Math.floor(TOKEN_EXPIRATION.REFRESH_TOKEN / 1000); // 30 days
const ACCESS_EXPIRE_SECONDS = Math.floor(TOKEN_EXPIRATION.ACCESS_TOKEN / 1000); // 5 minutes

interface StoredTokenData {
    token: string;
    fingerprint: string;
    createdAt: number;
    ip: string;
    userAgent: string;
    lastUsed?: number;
    usageCount?: number;
}

/**
 * Enhanced Service for managing both Refresh and Access Tokens via Redis.
 * Provides session validation, device fingerprinting, and automatic refresh capabilities.
 * Implements strong security for both token types since refresh tokens function as access tokens.
 */
export class RefreshService {
    private static client: RedisClient | undefined;

    static async init(): Promise<void> {
        RefreshService.client = await redisClient;
    }

    /**
     * Saves a refresh token with enhanced security tracking
     */
    static async saveRefreshToken(uuid: string, token: string, sessionId: string, ip?: string, ua?: string): Promise<void> {
        if (!RefreshService.client) throw new Error('Redis client not initialized');
        
        const key = `refresh_token:${uuid}:${sessionId}`;
        const fingerprint = new Fingerprint(ip || '0.0.0.0', ua || '');
        const payload: StoredTokenData = { 
            token, 
            fingerprint: JSON.stringify({
                ip: ip || '0.0.0.0',
                range: fingerprint['range'] || '',
                asn: fingerprint['asn'] || 0,
                hash: fingerprint['hash'] || ''
            }),
            createdAt: Date.now(),
            ip: ip || '0.0.0.0',
            userAgent: ua || '',
            usageCount: 0
        };
        
        await RefreshService.client.setex(key, REFRESH_EXPIRE_SECONDS, JSON.stringify(payload));
        logger.debug('RefreshService: Refresh token saved', { uuid, sessionId, ip });
    }

    /**
     * Saves an access token with session validation
     */
    static async saveAccessToken(uuid: string, token: string, sessionId: string, ip?: string, ua?: string): Promise<void> {
        if (!RefreshService.client) throw new Error('Redis client not initialized');
        
        const key = `access_token:${uuid}:${sessionId}`;
        const fingerprint = new Fingerprint(ip || '0.0.0.0', ua || '');
        const payload: StoredTokenData = { 
            token, 
            fingerprint: JSON.stringify({
                ip: ip || '0.0.0.0',
                range: fingerprint['range'] || '',
                asn: fingerprint['asn'] || 0,
                hash: fingerprint['hash'] || ''
            }),
            createdAt: Date.now(),
            ip: ip || '0.0.0.0',
            userAgent: ua || '',
            usageCount: 0
        };
        
        await RefreshService.client.setex(key, ACCESS_EXPIRE_SECONDS, JSON.stringify(payload));
        logger.debug('RefreshService: Access token saved', { uuid, sessionId, ip });
    }

    /**
     * Enhanced save method for backward compatibility - saves as refresh token
     */
    static async save(uuid: string, token: string, sessionId: string, ip?: string, ua?: string): Promise<void> {
        return this.saveRefreshToken(uuid, token, sessionId, ip, ua);
    }

    /**
     * Validates a refresh token with enhanced security checks
     */
    static async isRefreshValid(uuid: string, token: string, sessionId: string, ip?: string, ua?: string): Promise<boolean> {
        if (!sessionId) return false;
        
        const key = `refresh_token:${uuid}:${sessionId}`;
        const storedRaw = await RefreshService.client?.get(key);
        if (!storedRaw) {
            logger.warn('RefreshService: Refresh token not found', { uuid, sessionId, ip });
            return false;
        }

        try {
            const data: StoredTokenData = JSON.parse(storedRaw);
            
            // Check token match
            if (data.token !== token) {
                logger.warn('RefreshService: Refresh token mismatch', { uuid, sessionId, ip });
                return false;
            }

            // Check fingerprint
            const storedFingerprint = JSON.parse(data.fingerprint);
            const currentFingerprint = new Fingerprint(ip || '0.0.0.0', ua || '');
            
            if (!this.fingerprintsMatch(storedFingerprint, currentFingerprint)) {
                logger.warn('RefreshService: Refresh token fingerprint mismatch', { uuid, sessionId, ip });
                return false;
            }

            // Update usage statistics
            data.lastUsed = Date.now();
            data.usageCount = (data.usageCount || 0) + 1;
            await RefreshService.client?.setex(key, REFRESH_EXPIRE_SECONDS, JSON.stringify(data));

            logger.debug('RefreshService: Refresh token validated', { uuid, sessionId, ip, usageCount: data.usageCount });
            return true;
            
        } catch (err) {
            logger.error('RefreshService: Refresh token validation parse error', { error: err });
            return false;
        }
    }

    /**
     * Validates an access token with enhanced security checks
     */
    static async isAccessValid(uuid: string, token: string, sessionId: string, ip?: string, ua?: string): Promise<boolean> {
        if (!sessionId) return false;
        
        const key = `access_token:${uuid}:${sessionId}`;
        const storedRaw = await RefreshService.client?.get(key);
        if (!storedRaw) {
            logger.debug('RefreshService: Access token not found (expected for short-lived tokens)', { uuid, sessionId, ip });
            return false;
        }

        try {
            const data: StoredTokenData = JSON.parse(storedRaw);
            
            // Check token match
            if (data.token !== token) {
                logger.warn('RefreshService: Access token mismatch', { uuid, sessionId, ip });
                return false;
            }

            // Check fingerprint
            const storedFingerprint = JSON.parse(data.fingerprint);
            const currentFingerprint = new Fingerprint(ip || '0.0.0.0', ua || '');
            
            if (!this.fingerprintsMatch(storedFingerprint, currentFingerprint)) {
                logger.warn('RefreshService: Access token fingerprint mismatch', { uuid, sessionId, ip });
                return false;
            }

            // Update usage statistics
            data.lastUsed = Date.now();
            data.usageCount = (data.usageCount || 0) + 1;
            await RefreshService.client?.setex(key, ACCESS_EXPIRE_SECONDS, JSON.stringify(data));

            logger.debug('RefreshService: Access token validated', { uuid, sessionId, ip, usageCount: data.usageCount });
            return true;
            
        } catch (err) {
            logger.error('RefreshService: Access token validation parse error', { error: err });
            return false;
        }
    }

    /**
     * Unified validation method that checks both access and refresh tokens
     */
    static async isValid(uuid: string, token: string, sessionId: string, ip?: string, ua?: string, tokenType: 'access' | 'refresh' = 'refresh'): Promise<boolean> {
        if (tokenType === 'access') {
            return this.isAccessValid(uuid, token, sessionId, ip, ua);
        } else {
            return this.isRefreshValid(uuid, token, sessionId, ip, ua);
        }
    }

    /**
     * Helper method to compare fingerprints
     */
    private static fingerprintsMatch(stored: any, current: Fingerprint): boolean {
        try {
            // Compare IP range
            if (stored.ip !== (current as any).ip) return false;
            
            // Compare ASN
            if (stored.asn !== (current as any).asn) return false;
            
            // Compare hash (User-Agent based)
            if (stored.hash !== (current as any).hash) return false;
            
            return true;
        } catch (err) {
            logger.error('RefreshService: Fingerprint comparison error', { error: err });
            return false;
        }
    }

    /**
     * Revokes both access and refresh tokens for a session
     */
    static async revoke(uuid: string, sessionId?: string, ip?: string, ua?: string): Promise<void> {
        if (sessionId) {
            // Revoke specific session
            const accessKey = `access_token:${uuid}:${sessionId}`;
            const refreshKey = `refresh_token:${uuid}:${sessionId}`;
            
            await RefreshService.client?.del(accessKey);
            await RefreshService.client?.del(refreshKey);
            
            logger.info('RefreshService: Session tokens revoked', { uuid, sessionId, ip });
            return;
        }

        // Revoke all sessions for user
        const stream = RefreshService.client?.scanStream({ match: `*_token:${uuid}:*` });
        const keysToDelete: string[] = [];

        return new Promise((resolve, reject) => {
            stream?.on('data', (keys: string[]) => {
                if (keys.length) keysToDelete.push(...keys);
            });

            stream?.on('end', async () => {
                try {
                    if (keysToDelete.length) await RefreshService.client?.del(...keysToDelete);
                    logger.info('RefreshService: All user tokens revoked', { uuid, keyCount: keysToDelete.length });
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });

            stream?.on('error', (err: unknown) => reject(err));
        });
    }

    /**
     * Cleans up expired tokens (can be called periodically)
     */
    static async cleanupExpired(): Promise<void> {
        // Redis handles expiration automatically, but this can be used for logging/monitoring
        logger.debug('RefreshService: Token cleanup completed');
    }
}
