import {User} from '../entities/User';
import {UserRepository} from '../repositories/UserRepository';
import logger from '../utils/logger';

import {RefreshService} from './RefreshService';
import {TokenPair, TokenService, UserPayload} from './TokenService';

const userRepo = new UserRepository();

export enum AuthStatus
{
    AUTHENTICATED = 0,
    UNAUTHENTICATED = 1,
    FORBIDDEN = 2,
    EXPIRED = 3,
}

export class AuthService
{
    /**
     * Enhanced centralized authentication check with automatic refresh capabilities.
     * Implements strong security for both access and refresh tokens.
     */
    static async check(
        accessToken: string|undefined,
        refreshToken: string|undefined,
        sessionId: string|undefined,
        ip?: string,
        userAgent?: string): Promise<{user?: User; status: AuthStatus; autoRefreshed?: boolean}>
    {
        try {
            let payload: UserPayload|undefined;
            let user: User|undefined;

            // First, try to validate access token
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

            // Validate user exists and matches token
            const foundUser = await userRepo.findByUUID(payload.id);
            if (!foundUser) {
                logger.warn(
                    'Auth: user not found for id', payload.id);
                return {status: AuthStatus.FORBIDDEN};
            }
            user = foundUser;

            if (payload.email !== user.email) {
                logger.warn('Auth: token email mismatch', {
                    tokenEmail: payload.email,
                    userEmail: user.email
                });
                return {status: AuthStatus.FORBIDDEN};
            }

            if (!sessionId) {
                logger.warn('Auth: missing sessionId');
                return {status: AuthStatus.FORBIDDEN};
            }

            if (sessionId !== payload.sessionId) {
                logger.warn('Auth: session id mismatch', {
                    sessionId,
                    payloadSessionId: payload.sessionId
                });
                return {status: AuthStatus.FORBIDDEN};
            }

            // Enhanced: Check access token validity first with Redis validation
            const accessValid = await RefreshService.isAccessValid(
                user.uuid, accessToken, sessionId, ip, userAgent);

            if (accessValid) {
                logger.debug(
                    'Auth: user authenticated via access token',
                    {uuid: user.uuid, email: user.email});
                return {status: AuthStatus.AUTHENTICATED, user};
            }

            // Access token not valid in Redis, but JWT might still be valid
            // Check if refresh token is available for potential auto-refresh
            if (!refreshToken) {
                logger.warn('Auth: Access token expired, no refresh token available');
                return {status: AuthStatus.EXPIRED};
            }

            // Try to validate refresh token
            const refreshValid = await RefreshService.isRefreshValid(
                user.uuid, refreshToken, sessionId, ip, userAgent);

            if (refreshValid) {
                logger.info('Auth: Auto-refreshing tokens for user', {uuid: user.uuid, sessionId});
                
                // Generate new tokens
                const newTokens = TokenService.generateTokenPair({
                    id: user.uuid, 
                    email: user.email, 
                    sessionId: sessionId 
                });

                // Save both tokens with enhanced security
                await RefreshService.saveAccessToken(
                    user.uuid, newTokens.accessToken, sessionId, ip, userAgent);
                await RefreshService.saveRefreshToken(
                    user.uuid, newTokens.refreshToken, sessionId, ip, userAgent);

                logger.info('Auth: Auto-refresh completed successfully', {uuid: user.uuid, sessionId});
                return {status: AuthStatus.AUTHENTICATED, user, autoRefreshed: true};
            }

            logger.warn('Auth: Both access and refresh tokens invalid');
            return {status: AuthStatus.EXPIRED};

        } catch (err) {
            logger.error('Auth: unexpected error', err);
            return {status: AuthStatus.FORBIDDEN};
        }
    }

    /**
     * Enhanced login with dual token storage
     */
    static async login(user: User, sessionId: string, ip: string, ua: string):
        Promise<TokenPair>
    {
        logger.info(
            'AuthService.login - generating enhanced security tokens',
            {uuid: user.uuid, sessionId});
        const tokens = TokenService.generateTokenPair(
            {id: user.uuid, email: user.email, sessionId: sessionId });
        
        // Save both tokens with enhanced security
        await RefreshService.saveAccessToken(
            user.uuid, tokens.accessToken, sessionId, ip, ua);
        await RefreshService.saveRefreshToken(
            user.uuid, tokens.refreshToken, sessionId, ip, ua);

        return tokens;
    }

    /**
     * Enhanced refresh with dual token rotation
     */
    static async refresh(user: User, oldToken: string, sessionId: string, ip: string, ua: string): Promise<TokenPair | null>
    {
        logger.info(
            'AuthService.refresh - rotating enhanced security tokens',
            {uuid: user.uuid, sessionId});

        const newTokens = TokenService.generateTokenPair(
            {id: user.uuid, email: user.email, sessionId: sessionId});

        // Revoke old tokens
        await RefreshService.revoke(user.uuid, sessionId);

        // Save new tokens with enhanced security
        await RefreshService.saveAccessToken(
            user.uuid, newTokens.accessToken, sessionId, ip, ua);
        await RefreshService.saveRefreshToken(
            user.uuid, newTokens.refreshToken, sessionId, ip, ua);

        return newTokens;
    }

    /**
     * Enhanced logout with complete token revocation
     */
    static async logout(token: string, sessionId?: string): Promise<void>
    {
        logger.info('AuthService.logout - revoking enhanced security tokens', {sessionId});

        try {
            const payload = TokenService.verifyRefresh(token) as UserPayload;
            await RefreshService.revoke(payload.id, sessionId);
        } catch {
            logger.debug('AuthService.logout - invalid token');
        }
    }
}
