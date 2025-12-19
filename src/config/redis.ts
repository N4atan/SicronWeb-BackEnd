import Redis from 'ioredis';
import InMemoriaRedis from '../utils/InMemoriaRedis';
import logger from '../utils/logger';

export type RedisClient = {
    get: (key: string) => Promise<string | null>;
    set: (...args: unknown[]) => Promise<unknown>;
    setex: (key: string, ttl: number, value: string) => Promise<unknown>;
    del: (...keys: string[]) => Promise<unknown>;
    scanStream: (opts: { match?: string }) => NodeJS.ReadableStream;
};

async function createRedisClient(): Promise<RedisClient> {
    const requested = process.env.REDIS_MODE as 'redis' | 'in-memory' | undefined;

    if (requested === 'in-memory') {
        const client = new InMemoriaRedis();
        await client.connect();
        return client as unknown as RedisClient;
    }

    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    const client = new Redis(redisUrl, {
        maxRetriesPerRequest: null,
        retryStrategy: (times) => Math.min(times * 100, 2000),
    });

    client.on('connect', () => logger.debug('Redis connected'));
    client.on('error', (err: unknown) => logger.error('Redis client error:', err));
    client.on('end', () => logger.warn('Redis connection closed'));
    
    return client as unknown as RedisClient;
}

let redisClient: RedisClient;

(async () => {
    redisClient = await createRedisClient();
})().catch((err) => {
    logger.error('Redis initialization failed:', err);
});

export default redisClient!;