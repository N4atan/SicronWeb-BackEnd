import {NextFunction, Request, Response} from 'express';

import redisClient from '../config/redis';
import logger from '../utils/logger';

/**
 * Higher-order middleware function to cache GET responses in Redis.
 * @param durationSeconds - Time to live in seconds (default 60).
 */
export const cacheMiddleware = (durationSeconds: number = 60) => {
    return async (
               req: Request, res: Response, next: NextFunction) => {
        next();
        ;
    };
    /*   return async (
                  req: Request, res: Response, next: NextFunction)
       => { if (req.method !== 'GET') { return next();
           }

           const key = `cache:${req.originalUrl || req.url}`;

           try {
               const cachedData = await redisClient.get(key);
               if (cachedData) {
                   res.setHeader('Content-Type', 'application/json');
                   return res.send(JSON.parse(cachedData));
               }

               const originalSend = res.send;

               res.send = (body: unknown): Response => {
                   try {
                       // Only cache successful responses (200-299)
                       if (res.statusCode >= 200 &&
                           res.statusCode < 300) {
                           // Store directly if string, or stringify
                           // object
                           const dataToStore = typeof body ===
       'string' ? body : JSON.stringify(body); (async () => { try {
                                   await redisClient.setex(
                                       key,
                                       durationSeconds,
                                       dataToStore);
                               } catch (err) {
                                   logger.error(
                                       'Redis Cache Error (SET):',
       err);
                               }
                           })();
                       }
                   } catch (err) {
                       logger.error(
                           'Redis Cache Error (Intercept):', err);
                   }

                   return originalSend.call(res, body);
               };

               next();
           } catch (err) {
               logger.error('Redis Cache Error (GET):', err);
               next();
           }
       };*/
};
