import redisClient from "../config/redis";

const REFRESH_EXPIRE_SECONDS = 7 * 24 * 60 * 60; // 7 Dias em segundos

export class RefreshService
{
    static async save(uuid: string, token: string, ip: string): Promise<void>
    {
        const key = `refresh_token:${uuid}:${ip}`;
        await redisClient.set(key, token, 'EX', REFRESH_EXPIRE_SECONDS);
    }

    static async isValid(uuid: string, token: string, ip: string | undefined): Promise<boolean>
    {
        if (!ip) return false;

        const key = `refresh_token:${uuid}:${ip}`;
        const storedToken = await redisClient.get(key);

        return storedToken === token;
    }

    static async revoke(uuid: string, ip?: string): Promise<void>
    {
        if (ip) {
            const key = `refresh_token:${uuid}:${ip}`;
            await redisClient.del(key);
        } else {
            const stream = redisClient.scanStream({
                match: `refresh_token:${uuid}:*`
            });

            stream.on('data', (keys: string[]) => {
                if (keys.length) {
                    const pipeline = redisClient.pipeline();
                    keys.forEach((key) => pipeline.del(key));
                    pipeline.exec();
                }
            });
        }
    }
}
