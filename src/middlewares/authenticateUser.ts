import {NextFunction, Request, Response} from 'express';

import {UserRole} from '../entities/User';
import {AuthService, AuthStatus} from '../services/AuthService';
import {clearAuthCookies, clearSessionIdCookie, setAccessTokenCookie} from '../utils/cookieUtils';
import logger from '../utils/logger';

/**
 * Enhanced Middleware Factor for User Authentication with Auto-Refresh.
 * Verifies Access and Refresh tokens, implements automatic token refresh,
 * and checks optional Role requirements.
 *
 * @param required - If true, returns 401 if auth fails. If false,
 *     continues matching routes (optional auth).
 * @param roles - Array of allowed UserRoles. If provided, checks if
 *     user has one of them.
 * @returns Express Middleware
 */

export function authenticateUser(
    required: boolean = false, roles?: UserRole[]|null)
{
    return async (
               req: Request, res: Response, next: NextFunction) => {
        const accessToken = req.cookies?.accessToken || undefined;
        const refreshToken = req.cookies?.refreshToken || undefined;
        const sessionId = req.cookies?.sessionId || undefined;

        const {user, status, autoRefreshed} = await AuthService.check(
            accessToken, refreshToken, sessionId, req.ip, req.get('user-agent') || '');

        switch (status) {
            case AuthStatus.AUTHENTICATED:
                if (roles && !roles.includes(user!.role)) {
                    return res.sendStatus(403);
                }

                req.user = user;
                
                // If tokens were auto-refreshed, log the event
                if (autoRefreshed && user) {
                    logger.debug('Auth middleware: User authenticated with auto-refresh', {uuid: user.uuid});
                }
                
                return next();
                
            case AuthStatus.EXPIRED:
                if (required) {
                    return res.sendStatus(401);
                }
                return next();

            case AuthStatus.FORBIDDEN:
                clearAuthCookies(res);
                clearSessionIdCookie(res);
                if (required) {
                    return res.sendStatus(403);
                }
                return next();

            case AuthStatus.UNAUTHENTICATED:
            default:
                if (required || roles) {
                    return res.sendStatus(401);
                }
                return next();
        }
    };
}
