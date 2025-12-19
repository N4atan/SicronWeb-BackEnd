import {User} from '../entities/User';
import {UserRepository} from '../repositories/UserRepository';
import logger from '../utils/logger';

import {RefreshService} from './RefreshService';
import {TokenPair, TokenService, UserPayload} from './TokenService';

const userRepo = new UserRepository();

export enum AuthStatus {
    AUTHENTICATED = 0,
    UNAUTHENTICATED = 1,
    FORBIDDEN = 2,
    EXPIRED = 3,
}

export class AuthService
{
    /**
     * Centralized authentication check used by middlewares.
     * Refactored to avoid direct usage of req/res.
     */
    static async check(
        accessToken: string|undefined,
        refreshToken: string|undefined,
        sessionId: string|
        undefined): Promise<{user?: User; status: AuthStatus}>
    {
        try {
            let payload: UserPayload|undefined;

            if (!accessToken) {
                logger.debug('Auth: no access token provided');
                return {status: AuthStatus.UNAUTHENTICATED};
            }

            try {
                payload = TokenService.verifyAccess(accessToken) as
                    UserPayload;
            } catch (err) {
                logger.warn(
                    'Auth: access token verification failed', err);
                return {status: AuthStatus.EXPIRED};
            }

            if (!payload?.id) {
                logger.warn('Auth: access token missing id');
                return {status: AuthStatus.FORBIDDEN};
            }

            const user = await userRepo.findByUUID(payload.id);
            if (!user?.id) {
                logger.warn(
                    'Auth: user not found for id', payload.id);
                return {status: AuthStatus.FORBIDDEN};
            }

            if (payload.email !== user.email) {
                logger.warn('Auth: token email mismatch', {
                    tokenEmail: payload.email,
                    userEmail: user.email
                });
                return {status: AuthStatus.FORBIDDEN};
            }

            if (!sessionId) {
                logger.warn(
                    'Auth: refresh token present but missing sessionId');
                return {status: AuthStatus.FORBIDDEN};
            }

            if (!refreshToken) {
                logger.warn('Auth: Refresh token not present');
                return {status: AuthStatus.FORBIDDEN};
            }

            const valid = await RefreshService.isValid(
                user.uuid, refreshToken, sessionId);
            if (!valid) {
                logger.warn('Auth: refresh token not valid');
                return {status: AuthStatus.EXPIRED};
            }


            logger.debug(
                'Auth: user authenticated',
                {uuid: user.uuid, email: user.email});
            return {status: AuthStatus.AUTHENTICATED, user};
        } catch (err) {
            logger.error('Auth: unexpected error', err);
            return {status: AuthStatus.FORBIDDEN};
        }
    }

    // Pure service methods: do not touch Express `res`/`req`.
    // Return token pairs so controllers can set cookies.
    static async login(user: User, sessionId: string):
        Promise<TokenPair>
    {
        logger.info(
            'AuthService.login - generating tokens',
            {uuid: user.uuid, sessionId});
        const tokens = TokenService.generateTokenPair(
            {id: user.uuid, email: user.email});
        await RefreshService.save(
            user.uuid, tokens.refreshToken, sessionId);

        return tokens;
    }

    static async refresh(
        user: User, oldToken: string, sessionId?: string):
        Promise<TokenPair>
    {
        logger.info(
            'AuthService.refresh - rotating tokens',
            {uuid: user.uuid, sessionId});
        const newTokens = TokenService.generateTokenPair(
            {id: user.uuid, email: user.email});
        await RefreshService.revoke(user.uuid, sessionId);
        await RefreshService.save(
            user.uuid,
            newTokens.refreshToken,
            sessionId || user.uuid);
        return newTokens;
    }

    static async logout(token?: string, sessionId?: string):
        Promise<void>
    {
        logger.info(
            'AuthService.logout - revoking tokens', {sessionId});
        if (!token) return;
        try {
            const payload =
                TokenService.verifyRefresh(token) as UserPayload;
            await RefreshService.revoke(payload.id, sessionId);
        } catch {
            logger.debug(' - invalid token')
        }
    }
}
