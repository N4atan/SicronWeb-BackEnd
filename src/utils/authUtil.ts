import {Response} from 'express';

import {User} from '../entities/User';
import {RefreshService} from '../services/RefreshService';
import {TokenService, UserPayload} from '../services/TokenService';

import {clearAuthCookies, setAuthCookies} from './cookieUtils';

/**
 * Utility class for Authentication operations.
 * Handles Login, Logout, Refresh, and Session Clearing.
 */
export class AuthUtil
{
    /**
     * Handles the login process: generates tokens, saves refresh
     * token, sets cookies.
     * @param res - Express Response.
     * @param user - User object.
     * @param ip - Client IP.
     */
    static async login(res: Response, user: User, ip: string)
    {
        const tokens = TokenService.generateTokenPair({
            id: user.uuid,
            email: user.email,
        });

        await RefreshService.save(user.uuid, tokens.refreshToken, ip);
        setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
    }

    /**
     * Handles the logout process: revokes refresh token, clears
     * cookies.
     * @param res - Express Response.
     * @param token - Refresh Token string.
     * @param ip - Client IP.
     */
    static async logout(
        res: Response, token: string|undefined, ip: string)
    {
        if (token) {
            try {
                const payload =
                    TokenService.verifyRefresh(token) as UserPayload;
                await RefreshService.revoke(payload.id, ip);
            } catch {
                // Ignore invalid token on logout
            }
        }
        clearAuthCookies(res);
    }

    /**
     * Handles token refresh: generates new pair, revokes old, saves
     * new, sets cookies.
     * @param res - Express Response.
     * @param user - User object.
     * @param oldToken - Old Refresh Token.
     * @param ip - Client IP.
     */
    static async refresh(
        res: Response, user: User, oldToken: string, ip: string)
    {
        const newTokens = TokenService.generateTokenPair({
            id: user.uuid,
            email: user.email,
        });

        await RefreshService.revoke(user.uuid, ip);
        await RefreshService.save(
            user.uuid, newTokens.refreshToken, ip);

        setAuthCookies(
            res, newTokens.accessToken, newTokens.refreshToken);
    }

    /**
     * Clears the session cookies without revoking tokens (e.g.
     * invalid token).
     * @param res - Express Response.
     */
    static clearSession(res: Response)
    {
        clearAuthCookies(res);
    }
}
