import Redis from 'ioredis';

import InMemoriaRedis from '../utils/InMemoriaRedis';
import logger from '../utils/logger';

let clientInstance: Redis|InMemoriaRedis|null = null;
let currentMode: 'redis'|'in-memory'|null = null;

export async function getRedisClient(mode?: 'redis'|'in-memory')
{
    const envMode =
        process.env.REDIS_MODE as 'redis' | 'in-memory' | undefined;
    const requested: 'redis'|'in-memory' = mode || envMode ||
        (process.env.REDIS_URL ? 'redis' : 'in-memory');

    if (currentMode === 'redis')
        return clientInstance as Redis;

    if (clientInstance && currentMode === requested) {
        return clientInstance;
    }

    if (clientInstance && currentMode !== requested) {
        logger.warn(`Redis mode changed from "${currentMode}" to "${
            requested}"`);
        try {
            if ('quit' in clientInstance &&
                typeof clientInstance.quit === 'function') {
                await clientInstance.quit();
            }
        } catch (err: unknown) {
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

    // Redis real
    const redisUrl =
        process.env.REDIS_URL || 'redis://localhost:6379';
    const redisClient = new Redis(redisUrl, {
        reconnectOnError: (err) => {
            logger.warn('Redis reconnect triggered:', err);
            return true;
        },
        maxRetriesPerRequest: null,
        retryStrategy: (times) => Math.min(times * 50, 2000),  // ms
    });

    redisClient.on('error', (err: unknown) => {
        logger.error('Redis client error:', err);
    });

    try {
        await redisClient.connect();
        logger.debug('ioredis connected');
        clientInstance = redisClient;
        currentMode = 'redis';
    } catch (err: unknown) {
        logger.error(
            'ioredis connect error, falling back to in-memory:', err);
        clientInstance = new InMemoriaRedis();
        await clientInstance.connect();
        currentMode = 'in-memory';
    }

    return clientInstance;
}

export default getRedisClient;