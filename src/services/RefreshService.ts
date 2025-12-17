import redisClient from '../config/redis';

const REFRESH_EXPIRE_SECONDS = 7 * 24 * 60 * 60; // 7 Days in seconds

/**
 * Service for managing Refresh Tokens via Redis.
 *
 * Tokens are bound to a device identifier (deviceId) instead of
 * client IP. This allows sessions to persist across IP changes
 * for the same device while still enabling per-device revocation.
 */
export class RefreshService
{
    /**
     * Saves a refresh token in Redis.
     *
     * @param uuid - User UUID.
     * @param token - The refresh token string.
     * @param ip - Client IP address.
     * @returns Promise<void>
     */
    static async save(uuid: string, token: string, deviceId: string):
        Promise<void>
    {
        const key = `refresh_token:${uuid}:${deviceId}`;
        await redisClient.set(key, token, 'EX', REFRESH_EXPIRE_SECONDS);
    }

    /**
     * Validates a refresh token against Redis.
     *
     * @param uuid - User UUID.
     * @param token - The refresh token string to match.
     * @param ip - Client IP address (required).
     * @returns Promise<boolean> - True if valid, false otherwise.
     */
    static async isValid(
        uuid: string,
        token: string,
        deviceId?: string|undefined,
    ): Promise<boolean>
    {
        // If deviceId provided, check the exact key.
        if (deviceId) {
            const key = `refresh_token:${uuid}:${deviceId}`;
            const storedToken = await redisClient.get(key);
            return storedToken === token;
        }

        // Fallback: scan all tokens for this user and see if any
        // matches. This allows a graceful transition if deviceId
        // is not available yet. It's less strict but avoids
        // breaking active sessions while migration occurs.
        return new Promise<boolean>((resolve, reject) => {
            const stream = redisClient.scanStream({ match: `refresh_token:${uuid}:*` });
            let found = false;

            stream.on('data', async (keys: string[]) => {
                if (found) return;
                if (!keys.length) return;
                try {
                    const pipeline = redisClient.pipeline();
                    keys.forEach((k) => pipeline.get(k));
                    const results = await pipeline.exec() || [];
                    for (const [, value] of results) {
                        if (value === token) {
                            found = true;
                            stream.destroy();
                            return resolve(true);
                        }
                    }
                } catch (err) {
                    stream.destroy();
                    return reject(err);
                }
            });

            stream.on('end', () => resolve(found));
            stream.on('error', (err: unknown) => reject(err));
        });
    }

    /**
     * Revokes refresh tokens.
     *
     * @param uuid - User UUID.
     * @param ip - Optional IP to revoke specific token. If omitted,
     *     revokes ALL tokens for user.
     * @returns Promise<void>
     */
    static async revoke(uuid: string, deviceId?: string): Promise<void>
    {
        if (deviceId) {
            const key = `refresh_token:${uuid}:${deviceId}`;
            await redisClient.del(key);
            return;
        }

        // Revoke all device tokens for this user.
        return new Promise((resolve, reject) => {
            const stream = redisClient.scanStream({ match: `refresh_token:${uuid}:*` });
            const pipelines: Promise<unknown>[] = [];

            stream.on('data', (keys: string[]) => {
                if (keys.length) {
                    const pipeline = redisClient.pipeline();
                    keys.forEach((key) => pipeline.del(key));
                    pipelines.push(pipeline.exec());
                }
            });

            stream.on('end', async () => {
                try {
                    await Promise.all(pipelines);
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });

            stream.on('error', (err: unknown) => reject(err));
        });
    }
}
