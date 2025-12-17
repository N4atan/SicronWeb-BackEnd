import Redis from 'ioredis';

import {ENV} from './env';

const redisClient = new Redis(ENV.REDIS_URL);

redisClient.on(
    'error',
    (err: unknown) => console.error('Redis Client Error', err));
redisClient.on('connect', () => console.log('Redis Connected!'));

/**
 * Singleton Redis Client instance.
 */
export default redisClient;
