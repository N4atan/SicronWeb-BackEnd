import {NextFunction, Request, Response} from 'express';

import getRedisClient from '../config/redis';

/**
 * Higher-order middleware function to cache GET responses in Redis.
 * @param durationSeconds - Time to live in seconds (default 60).
 */
export const cacheMiddleware = (durationSeconds: number = 60) => {
    return async (
               req: Request, res: Response, next: NextFunction) => {
        if (req.method !== 'GET') {
            return next();
        }

        const key = `cache:${req.originalUrl || req.url}`;

        try {
            const client = await getRedisClient();
            const cachedData = await client.get(key);
            if (cachedData) {
                res.setHeader('Content-Type', 'application/json');
                return res.send(JSON.parse(cachedData));
            }

            // Hook into res.send to intercept the response
            const originalSend = res.send;

            res.send = (body: unknown): Response => {
                try {
                    // Only cache successful responses (200-299)
                    if (res.statusCode >= 200 &&
                        res.statusCode < 300) {
                        // Store directly if string, or stringify
                        // object
                        const dataToStore = typeof body === 'string' ? body : JSON.stringify(body);
                        (async () => {
                            try {
                                if (typeof (client as any).setex === 'function') {
                                    await (client as any).setex(key, durationSeconds, dataToStore);
                                } else if (typeof (client as any).set === 'function') {
                                    try {
                                        await (client as any).set(key, dataToStore, 'EX', durationSeconds);
                                    } catch (_) {
                                        await (client as any).set(key, dataToStore, { EX: durationSeconds });
                                    }
                                }
                            } catch (err) {
                                console.error('Redis Cache Error (SET):', err);
                            }
                        })();
                    }
                } catch (err) {
                    console.error(
                        'Redis Cache Error (Intercept):', err);
                }

                return originalSend.call(res, body);
            };

            next();
        } catch (err) {
            console.error('Redis Cache Error (GET):', err);
            next();  // Proceed even if cache fails
        }
    };
};
