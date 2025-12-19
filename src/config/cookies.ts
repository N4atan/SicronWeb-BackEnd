/**
 * Cookie names used in the application.
 */
export const COOKIE_NAMES = {
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
    SESSION_ID: 'sessionId',
};

/**
 * Token expiration times in milliseconds.
 */
export const TOKEN_EXPIRATION = {
    ACCESS_TOKEN: 15 * 60 * 1000,            // 15 Minutes
    REFRESH_TOKEN: 7 * 24 * 60 * 60 * 1000,  // 7 Days
};

/**
 * Build cookie options dynamically based on environment for
 * compatibility with Render, AWS (behind proxies) and mobile
 * clients.
 */
export function getCookieOptions()
{
    const secureEnv = process.env.COOKIE_SECURE;
    const sameSiteEnv = process.env.COOKIE_SAMESITE;
    const domain = process.env.COOKIE_DOMAIN || undefined;

    const secure = typeof secureEnv !== 'undefined' ?
        secureEnv === 'true' :
        process.env.NODE_ENV === 'production';

    const sameSite =
        (sameSiteEnv as 'lax' | 'strict' | 'none' | undefined) ||
        'lax';

    return {
        httpOnly: true,
        secure,
        sameSite,
        domain: domain || undefined
    } as const;
}

export const SESSION_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE ?
        process.env.COOKIE_SECURE === 'true' :
        process.env.NODE_ENV === 'production',
    sameSite: (process.env.COOKIE_SAMESITE as 'lax' | 'strict' |
               'none' | undefined) ||
        'lax',
    domain: process.env.COOKIE_DOMAIN || undefined,
    maxAge: 365 * 24 * 60 * 60 * 1000,  // 1 year
} as const;
