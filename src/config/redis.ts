import Redis from 'ioredis';
import InMemoriaRedis from '../utils/InMemoriaRedis';
import logger from '../utils/logger';

let clientInstance: Redis | InMemoriaRedis | null = null;
let currentMode: 'redis' | 'in-memory' | null = null;

export async function getRedisClient(mode?: 'redis' | 'in-memory') {
    const envMode = process.env.REDIS_MODE as 'redis' | 'in-memory' | undefined;
    const requested: 'redis' | 'in-memory' =
        mode || envMode || (process.env.REDIS_URL ? 'redis' : 'in-memory');

    if (clientInstance && currentMode === requested) return clientInstance;

    if (clientInstance && currentMode !== requested) {
        logger.warn(`Redis mode changed from "${currentMode}" to "${requested}"`);
        try {
            if ('quit' in clientInstance && typeof clientInstance.quit === 'function')
                await clientInstance.quit();
        } catch (err) {
            logger.error('Error closing previous Redis client:', err);
        }
        clientInstance = null;
        currentMode = null;
    }

    if (requested === 'in-memory') {
        clientInstance = new InMemoriaRedis();
        await clientInstance.connect();
        currentMode = 'in-memory';
        return clientInstance;
    }

    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    const redisClient = new Redis(redisUrl, {
        maxRetriesPerRequest: null,
        retryStrategy: (times) => Math.min(times * 100, 2000),
    });

    redisClient.on('connect', () => logger.debug('Redis connected'));
    redisClient.on('error', (err: unknown) => {
        logger.error('Redis client error:', err);
    });
    redisClient.on('end', () => {
        logger.warn('Redis connection closed');
    });

    try {
        await redisClient.connect();
        clientInstance = redisClient;
        currentMode = 'redis';
        return clientInstance;
    } catch (err) {
        logger.error('ioredis connect error, falling back to in-memory:', err);
        clientInstance = new InMemoriaRedis();
        await clientInstance.connect();
        currentMode = 'in-memory';
        return clientInstance;
    }
}

export default getRedisClient;