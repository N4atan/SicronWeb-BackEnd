import Redis from 'ioredis';

const redisClient = new Redis(process.env.REDIS_URL as string);

redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.on('connect', () => console.log('Redis Connected!'));

export default redisClient;
