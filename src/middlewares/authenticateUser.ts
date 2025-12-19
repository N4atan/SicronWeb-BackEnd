import {NextFunction, Request, Response} from 'express';

import {UserRole} from '../entities/User';
import {AuthService, AuthStatus} from '../services/AuthService';
import {AuthUtil} from '../utils/AuthUtil';

/**
 * Middleware Factor for User Authentication.
 * Verifies Access and Refresh tokens, and checks optional Role
 * requirements.
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

        const {user, status} = await AuthService.check(
            accessToken, refreshToken, sessionId);

        switch (status) {
            case AuthStatus.AUTHENTICATED:
                if (roles && !roles.includes(user!.role)) {
                    return res.sendStatus(403);
                }

                req.user = user;
                return next();
            case AuthStatus.EXPIRED:
                if (required) {
                    return res.sendStatus(401);
                }
                return next();

            case AuthStatus.FORBIDDEN:
                await AuthUtil.clearSession(res);
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