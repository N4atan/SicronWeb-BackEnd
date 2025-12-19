import {serialize} from 'cookie';
import {Response} from 'express';

import {COOKIE_NAMES, getCookieOptions, SESSION_COOKIE_OPTIONS, TOKEN_EXPIRATION,} from '../config/cookies';

/**
 * Sets authentication cookies (Refresh and Access tokens).
 * @param res - Express Response.
 * @param accessToken - Access Token string.
 * @param refreshToken - Refresh Token string.
 */
export const setAuthCookies = (
    res: Response,
    accessToken: string,
    refreshToken: string,
    ) => {
    const options = getCookieOptions();

    const refreshCookie =
        serialize(
            COOKIE_NAMES.REFRESH_TOKEN,
            refreshToken,
            {
                ...options,
                maxAge: TOKEN_EXPIRATION.REFRESH_TOKEN,
                path: '/',
            },
            ) +
        '; Partitioned';

    const accessCookie =
        serialize(
            COOKIE_NAMES.ACCESS_TOKEN,
            accessToken,
            {
                ...options,
                maxAge: TOKEN_EXPIRATION.ACCESS_TOKEN,
                path: '/',
            },
            ) +
        '; Partitioned';

    res.append('Set-Cookie', refreshCookie);
    res.append('Set-Cookie', accessCookie);
};

/**
 * Clears authentication cookies.
 * @param res - Express Response.
 */
export const clearAuthCookies = (res: Response) => {
    const options = getCookieOptions();

    const clearRefresh = serialize(
                             COOKIE_NAMES.REFRESH_TOKEN,
                             '',
                             {...options, maxAge: 0, path: '/'},
                             ) +
        '; Partitioned';

    const clearAccess = serialize(
                            COOKIE_NAMES.ACCESS_TOKEN,
                            '',
                            {...options, maxAge: 0, path: '/'},
                            ) +
        '; Partitioned';

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