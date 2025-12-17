import {Response} from 'express';

import {User} from '../entities/User';
import {RefreshService} from '../services/RefreshService';
import {TokenService, UserPayload} from '../services/TokenService';

import {clearAuthCookies, setAuthCookies, setDeviceIdCookie, clearDeviceIdCookie} from './cookieUtils';

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
    static async login(res: Response, user: User, deviceId: string)
    {
        const tokens = TokenService.generateTokenPair({ id: user.uuid, email: user.email });

        await RefreshService.save(user.uuid, tokens.refreshToken, deviceId);
        setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

        // Ensure the client has a persistent deviceId cookie for
        // future session checks. deviceId is intentionally not
        // httpOnly so client code can persist/reuse it.
        try {
            setDeviceIdCookie(res, deviceId);
        } catch {
            // Non-fatal: just continue.
        }
    }

    /**
     * Handles the logout process: revokes refresh token, clears
     * cookies.
     * @param res - Express Response.
     * @param token - Refresh Token string.
     * @param ip - Client IP.
     */
    static async logout(res: Response, token: string|undefined, deviceId?: string)
    {
        if (token) {
            try {
                const payload = TokenService.verifyRefresh(token) as UserPayload;
                await RefreshService.revoke(payload.id, deviceId);
            } catch {
                // Ignore invalid token on logout
            }
        }

        clearAuthCookies(res);
        clearDeviceIdCookie(res);
    }

    /**
     * Handles token refresh: generates new pair, revokes old, saves
     * new, sets cookies.
     * @param res - Express Response.
     * @param user - User object.
     * @param oldToken - Old Refresh Token.
     * @param ip - Client IP.
     */
    static async refresh(res: Response, user: User, oldToken: string, deviceId?: string)
    {
        const newTokens = TokenService.generateTokenPair({ id: user.uuid, email: user.email });

        await RefreshService.revoke(user.uuid, deviceId);
        await RefreshService.save(user.uuid, newTokens.refreshToken, deviceId || user.uuid);

        setAuthCookies(res, newTokens.accessToken, newTokens.refreshToken);
        if (deviceId) setDeviceIdCookie(res, deviceId);
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
