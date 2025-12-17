import redisClient from '../config/redis';

const REFRESH_EXPIRE_SECONDS = 7 * 24 * 60 * 60;  // 7 Days in seconds

/**
 * Service for managing Refresh Tokens via Redis.
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
    static async save(uuid: string, token: string, ip: string):
        Promise<void>
    {
        const key = `refresh_token:${uuid}:${ip}`;
        await redisClient.set(
            key, token, 'EX', REFRESH_EXPIRE_SECONDS);
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
        ip: string|undefined,
        ): Promise<boolean>
    {
        if (!ip) return false;

        const key = `refresh_token:${uuid}:${ip}`;
        const storedToken = await redisClient.get(key);

        return storedToken === token;
    }

    /**
     * Revokes refresh tokens.
     *
     * @param uuid - User UUID.
     * @param ip - Optional IP to revoke specific token. If omitted,
     *     revokes ALL tokens for user.
     * @returns Promise<void>
     */
    static async revoke(uuid: string, ip?: string): Promise<void>
    {
        if (ip) {
            const key = `refresh_token:${uuid}:${ip}`;
            await redisClient.del(key);
        }
        else {
            return new Promise((resolve, reject) => {
                const stream = redisClient.scanStream({
                    match: `refresh_token:${uuid}:*`,
                });

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
}
