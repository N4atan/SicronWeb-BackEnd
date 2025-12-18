import {NextFunction, Request, Response} from 'express';

import logger from '../utils/logger';
import {SQLErrorUtil} from '../utils/sqlErrorUtil';

/**
 * Global Error Handler Middleware.
 * Intercepts unhandled errors and SQL errors.
 */
export function errorHandler(
    err: unknown,
    req: Request,
    res: Response,
    _next: NextFunction,
)
{
    if (SQLErrorUtil.handle(err, res)) return;

    logger.error(`INTERNAL SERVER ERROR:`, err);
    res.status(500).json({message: 'Internal Server Error'});
}
