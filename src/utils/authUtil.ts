import {Response} from 'express';

import {User} from '../entities/User';
import {RefreshService} from '../services/RefreshService';
import {TokenService, UserPayload} from '../services/TokenService';

import {clearAuthCookies, clearSessionIdCookie, setAuthCookies, setSessionIdCookie} from './cookieUtils';

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
    static async login(res: Response, user: User, sessionId: string)
    {
        const tokens = TokenService.generateTokenPair(
            {id: user.uuid, email: user.email});

        await RefreshService.save(
            user.uuid, tokens.refreshToken, sessionId);
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
        res: Response, token: string|undefined, sessionId?: string)
    {
        if (token) {
            try {
                const payload =
                    TokenService.verifyRefresh(token) as UserPayload;
                await RefreshService.revoke(payload.id, sessionId);
            } catch {
                // Ignore invalid token on logout
            }
        }

        clearAuthCookies(res);
        clearSessionIdCookie(res);
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
        res: Response,
        user: User,
        oldToken: string,
        sessionId?: string)
    {
        const newTokens = TokenService.generateTokenPair(
            {id: user.uuid, email: user.email});

        await RefreshService.revoke(user.uuid, sessionId);
        await RefreshService.save(
            user.uuid,
            newTokens.refreshToken,
            sessionId || user.uuid);

        setAuthCookies(
            res, newTokens.accessToken, newTokens.refreshToken);
        if (sessionId) setSessionIdCookie(res, sessionId);
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
