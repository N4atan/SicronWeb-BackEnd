import {NextFunction, Request, Response} from 'express';

import {COOKIE_NAMES} from '../config/cookies';
import {UserRole} from '../entities/User';
import {UserRepository} from '../repositories/UserRepository';
import {RefreshService} from '../services/RefreshService';
import {TokenService, UserPayload} from '../services/TokenService';
import {AuthUtil} from '../utils/authUtil';

const userRepo = new UserRepository();

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
    required: boolean = false,
    roles?: UserRole[]|undefined|null,
)
{
    return async (
               req: Request, res: Response, next: NextFunction) => {
        req.user = null;
        req.logged = false;

        try {
            const accessToken =
                req.cookies?.[COOKIE_NAMES.ACCESS_TOKEN];
            const refreshToken =
                req.cookies?.[COOKIE_NAMES.REFRESH_TOKEN];

            if (!accessToken) {
                if (required) {
                    AuthUtil.clearSession(res);
                    return res.status(401).end();
                }
                return next();
            }

            const payload =
                TokenService.verifyAccess(accessToken) as UserPayload;
            if (!payload?.id) {
                if (required) {
                    AuthUtil.clearSession(res);
                    return res.status(401).end();
                }
                return next();
            }

            const user = await userRepo.findByUUID(payload.id);
            if (!user?.id) {
                if (required) {
                    AuthUtil.clearSession(res);
                    return res.status(401).end();
                }
                return next();
            }

            if (payload.email !== user.email) {
                if (required) {
                    AuthUtil.clearSession(res);
                    return res.status(401).end();
                }
                return next();
            }

            if (!RefreshService.isValid(
                    user.uuid, refreshToken, req.ip)) {
                if (required) {
                    AuthUtil.clearSession(res);
                    return res.status(401).end();
                }
                return next();
            }

            if (roles && !roles.includes(user.role))
                return res.status(403).end();

            req.user = user;
            req.logged = true;

            next();
        } catch {
            return required ? res.status(401).end() : next();
        }
    };
}
