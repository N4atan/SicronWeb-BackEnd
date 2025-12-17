import {Response} from 'express';

import {COOKIE_NAMES, getCookieOptions, SESSION_COOKIE_OPTIONS, TOKEN_EXPIRATION} from '../config/cookies';

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

    res.cookie(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, {
        ...options,
        maxAge: TOKEN_EXPIRATION.REFRESH_TOKEN,
    });

    res.cookie(COOKIE_NAMES.ACCESS_TOKEN, accessToken, {
        ...options,
        maxAge: TOKEN_EXPIRATION.ACCESS_TOKEN,
    });
};

/**
 * Clears authentication cookies.
 * @param res - Express Response.
 */
export const clearAuthCookies = (res: Response) => {
    const options = getCookieOptions();
    res.clearCookie(COOKIE_NAMES.REFRESH_TOKEN, options);
    res.clearCookie(COOKIE_NAMES.ACCESS_TOKEN, options);
};

export const setSessionIdCookie =
    (res: Response, sessionId: string) => {
        res.cookie(
            COOKIE_NAMES.SESSION_ID,
            sessionId,
            SESSION_COOKIE_OPTIONS);
    };

export const setSessionIdSessionCookie =
    (res: Response, sessionId: string) => {
        const {maxAge: _, ...rest} = SESSION_COOKIE_OPTIONS;
        res.cookie(COOKIE_NAMES.SESSION_ID, sessionId, rest);
    };

export const clearSessionIdCookie = (res: Response) => {
    res.clearCookie(COOKIE_NAMES.SESSION_ID, SESSION_COOKIE_OPTIONS);
};
