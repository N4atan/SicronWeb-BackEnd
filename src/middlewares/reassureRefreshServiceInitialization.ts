import {NextFunction, Request, Response} from 'express';

import {RefreshService} from '../services/RefreshService';

import logger from '../utils/logger';

/**
 * Awaits for RefreshService initialization.
*/
export async function reassureRefreshServiceInitialization(req: Request, res: Response, next: NextFunction)
{
	await RefreshService.init();
	next();
}
