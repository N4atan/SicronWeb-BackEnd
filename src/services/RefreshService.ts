import getRedisClient from '../config/redis';

const REFRESH_EXPIRE_SECONDS = 7 * 24 * 60 * 60;  // 7 Days in seconds

/**
 * Service for managing Refresh Tokens via Redis.
 *
 * Tokens are bound to a session identifier (sessionId) instead
 * of client IP. This identifies a logged session (per browser)
 * and allows per-session revocation.
 */
export class RefreshService
{
    /**
     * Saves a refresh token in Redis.
     *
     * @param uuid - User UUID.
     * @param token - The refresh token string.
     * @param sessionId - Session identifier.
     * @returns Promise<void>
     */
    static async save(uuid: string, token: string, sessionId: string):
        Promise<void>
    {
        const client = await getRedisClient();
        const key = `refresh_token:${uuid}:${sessionId}`;
        await client.set(key, token, 'EX', REFRESH_EXPIRE_SECONDS);
    }

    /**
     * Validates a refresh token against Redis.
     *
     * @param uuid - User UUID.
     * @param token - The refresh token string to match.
     * @param sessionId - Session identifier (required).
     * @returns Promise<boolean> - True if valid, false otherwise.
     */
    static async isValid(
        uuid: string, token: string, sessionId: string):
        Promise<boolean>
    {
        // Require explicit sessionId — no fallback scanning.
        if (!sessionId) return false;
        const client = await getRedisClient();
        const key = `refresh_token:${uuid}:${sessionId}`;
        const storedToken = await client.get(key);
        return storedToken === token;
    }

    /**
     * Revokes refresh tokens.
     *
     * @param uuid - User UUID.
     * @param sessionId - Optional sessionId to revoke specific token.
     *     If omitted, revokes ALL session tokens for user.
     * @returns Promise<void>
     */
    static async revoke(uuid: string, sessionId?: string):
        Promise<void>
    {
        const client = await getRedisClient();
        if (sessionId) {
            const key = `refresh_token:${uuid}:${sessionId}`;
            await client.del(key);
            return;
        }

        // Revoke all device tokens for this user by scanning keys.
        // The in-memory client provides a `scanStream` compatibility
        // helper.
        const stream = (client as any).scanStream({
            match: `refresh_token:${uuid}:*`
        });
        const keysToDelete: string[] = [];

        return new Promise((resolve, reject) => {
            stream.on('data', (keys: string[]) => {
                if (keys.length) keysToDelete.push(...keys);
            });

            stream.on('end', async () => {
                try {
                    if (keysToDelete.length)
                        await client.del(...keysToDelete);
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });

            stream.on('error', (err: unknown) => reject(err));
        });
    }
}
