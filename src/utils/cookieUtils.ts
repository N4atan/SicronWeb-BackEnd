import {serialize} from 'cookie';
import {Response} from 'express';

import {
    COOKIE_NAMES, 
    getAccessTokenCookieOptions, 
    getRefreshTokenCookieOptions, 
    SESSION_COOKIE_OPTIONS, 
    TOKEN_EXPIRATION
} from '../config/cookies';

/**
 * Sets enhanced authentication cookies with differentiated security levels.
 * Access tokens get maximum security, refresh tokens get standard security.
 * @param res - Express Response.
 * @param accessToken - Access Token string.
 * @param refreshToken - Refresh Token string.
 */
export const setAuthCookies = (
    res: Response,
    accessToken: string,
    refreshToken: string,
    ) => {
    const accessOptions = getAccessTokenCookieOptions();
    const refreshOptions = getRefreshTokenCookieOptions();

    // Enhanced refresh token cookie with standard security
    const refreshCookie = serialize(
        COOKIE_NAMES.REFRESH_TOKEN,
        refreshToken,
        {
            ...refreshOptions,
            maxAge: TOKEN_EXPIRATION.REFRESH_TOKEN,
            path: '/', // Allow refresh from any endpoint
        }
    );

    // Maximum security access token cookie
    const accessCookie = serialize(
        COOKIE_NAMES.ACCESS_TOKEN,
        accessToken,
        {
            ...accessOptions,
            maxAge: TOKEN_EXPIRATION.ACCESS_TOKEN,
            path: '/api/', // Restrict to API endpoints only
        }
    );

    res.append('Set-Cookie', refreshCookie);
    res.append('Set-Cookie', accessCookie);
};

/**
 * Sets only the access token cookie (for auto-refresh scenarios)
 * @param res - Express Response.
 * @param accessToken - Access Token string.
 */
export const setAccessTokenCookie = (
    res: Response,
    accessToken: string
    ) => {
    const accessOptions = getAccessTokenCookieOptions();

    const accessCookie = serialize(
        COOKIE_NAMES.ACCESS_TOKEN,
        accessToken,
        {
            ...accessOptions,
            maxAge: TOKEN_EXPIRATION.ACCESS_TOKEN,
            path: '/api/', // Restrict to API endpoints only
        }
    );

    res.append('Set-Cookie', accessCookie);
};

/**
 * Sets only the refresh token cookie
 * @param res - Express Response.
 * @param refreshToken - Refresh Token string.
 */
export const setRefreshTokenCookie = (
    res: Response,
    refreshToken: string
    ) => {
    const refreshOptions = getRefreshTokenCookieOptions();

    const refreshCookie = serialize(
        COOKIE_NAMES.REFRESH_TOKEN,
        refreshToken,
        {
            ...refreshOptions,
            maxAge: TOKEN_EXPIRATION.REFRESH_TOKEN,
            path: '/', // Allow refresh from any endpoint
        }
    );

    res.append('Set-Cookie', refreshCookie);
};

/**
 * Clears all authentication cookies with enhanced security.
 * @param res - Express Response.
 */
export const clearAuthCookies = (res: Response) => {
    const accessOptions = getAccessTokenCookieOptions();
    const refreshOptions = getRefreshTokenCookieOptions();

    // Clear refresh token with standard options
    const clearRefresh = serialize(
        COOKIE_NAMES.REFRESH_TOKEN,
        '',
        {
            ...refreshOptions, 
            maxAge: 0, 
            path: '/'
        }
    );

    // Clear access token with enhanced options
    const clearAccess = serialize(
        COOKIE_NAMES.ACCESS_TOKEN,
        '',
        {
            ...accessOptions, 
            maxAge: 0, 
            path: '/api/'
        }
    );

    res.append('Set-Cookie', clearRefresh);
    res.append('Set-Cookie', clearAccess);
};

/**
 * Sets the Session ID cookie (persistent).
 * @param res - Express Response.
 * @param sessionId - Session identifier string.
 */
export const setSessionIdCookie =
    (res: Response, sessionId: string) => {
        const sessionCookie = serialize(
                                  COOKIE_NAMES.SESSION_ID,
                                  sessionId,
                                  {
                                      ...SESSION_COOKIE_OPTIONS,
                                      path: '/',
                                  },
                                  ) +
            '; Partitioned';

        res.append('Set-Cookie', sessionCookie);
    };

/**
 * Sets the Session ID cookie (session-only).
 * @param res - Express Response.
 * @param sessionId - Session identifier string.
 */
export const setSessionIdSessionCookie =
    (res: Response, sessionId: string) => {
        const sessionCookie = serialize(
                                  COOKIE_NAMES.SESSION_ID,
                                  sessionId,
                                  {
                                      ...SESSION_COOKIE_OPTIONS,
                                      path: '/',
                                  },
                                  ) +
            '; Partitioned';

        res.append('Set-Cookie', sessionCookie);
    };

/**
 * Clears the Session ID cookie.
 * @param res - Express Response.
 */
export const clearSessionIdCookie = (res: Response) => {
    const clearSession =
        serialize(
            COOKIE_NAMES.SESSION_ID,
            '',
            {...SESSION_COOKIE_OPTIONS, maxAge: 0, path: '/'},
            ) +
        '; Partitioned';

    res.append('Set-Cookie', clearSession);
};