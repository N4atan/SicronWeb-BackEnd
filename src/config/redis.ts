// ...existing code...
import { createClient } from 'redis';

import InMemoriaRedis from '../utils/InMemoriaRedis';

let clientInstance: any = null;
let currentMode: 'redis' | 'in-memory' | null = null;

/**
 * getRedisClient(mode?)
 * - mode: optional override: 'redis' | 'in-memory'
 * - uses process.env.REDIS_URL and process.env.REDIS_MODE when not provided
 * - reuses singleton; closes previous client only when mode changes and logs the change once
 */
export async function getRedisClient(mode?: 'redis' | 'in-memory') {
    const envMode = (process.env.REDIS_MODE as 'redis' | 'in-memory' | undefined) || undefined;
    const requested = mode || envMode || (process.env.REDIS_URL ? 'redis' : 'in-memory');

    if (clientInstance && currentMode === requested) {
        return clientInstance;
    }

    if (clientInstance && currentMode !== requested) {
        // warn only when actually changing mode
        console.warn(`Redis mode changed from "${currentMode}" to "${requested}"`);
        try {
            if (typeof clientInstance.quit === 'function') {
                await clientInstance.quit();
            }
        } catch (err) {
            // ignore quit errors
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
    const client = createClient({ url: redisUrl });
    
    client.on('error', (err: any) => {
        console.error('Redis client error:', err);
    });

    await client.connect();

    clientInstance = client;
    currentMode = 'redis';

    return clientInstance;
}

export default getRedisClient;