import {Response} from 'express';

import {COOKIE_NAMES, COOKIE_OPTIONS, TOKEN_EXPIRATION,} from '../config/cookies';

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
    res.cookie(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, {
        ...COOKIE_OPTIONS,
        maxAge: TOKEN_EXPIRATION.REFRESH_TOKEN,
    });

    res.cookie(COOKIE_NAMES.ACCESS_TOKEN, accessToken, {
        ...COOKIE_OPTIONS,
        maxAge: TOKEN_EXPIRATION.ACCESS_TOKEN,
    });
};

/**
 * Clears authentication cookies.
 * @param res - Express Response.
 */
export const clearAuthCookies = (res: Response) => {
    res.clearCookie(COOKIE_NAMES.REFRESH_TOKEN, COOKIE_OPTIONS);
    res.clearCookie(COOKIE_NAMES.ACCESS_TOKEN, COOKIE_OPTIONS);
};
