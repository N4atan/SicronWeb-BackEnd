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
 * Enhanced security: Both tokens now have shorter, more secure lifetimes
 */
export const TOKEN_EXPIRATION = {
    ACCESS_TOKEN: 5 * 60 * 1000,             // 5 Minutes - Short-lived for maximum security
    REFRESH_TOKEN: 30 * 24 * 60 * 60 * 1000, // 30 Days - Longer refresh period with rotation
};

/**
 * Enhanced cookie options for access tokens (maximum security)
 * Access tokens require stricter security due to their critical nature
 */
export function getAccessTokenCookieOptions()
{
    const secureEnv = process.env.COOKIE_SECURE;
    const sameSiteEnv = process.env.COOKIE_SAMESITE;
    const domain = process.env.COOKIE_DOMAIN || undefined;

    const secure = typeof secureEnv !== 'undefined' ?
        secureEnv === 'true' :
        process.env.NODE_ENV === 'production';

    const sameSite =
        (sameSiteEnv as 'lax' | 'strict' | 'none' | undefined) ||
        'strict'; // Stricter sameSite for access tokens

    return {
        httpOnly: true,
        secure,
        sameSite,
        domain: domain || undefined,
        // Additional security for access tokens
        path: '/api/', // Restrict to API endpoints only
    } as const;
}

/**
 * Standard cookie options for refresh tokens
 * Less restrictive than access tokens but still secure
 */
export function getRefreshTokenCookieOptions()
{
    const secureEnv = process.env.COOKIE_SECURE;
    const sameSiteEnv = process.env.COOKIE_SAMESITE;
    const domain = process.env.COOKIE_DOMAIN || undefined;

    const secure = typeof secureEnv !== 'undefined' ?
        secureEnv === 'true' :
        process.env.NODE_ENV === 'production';

    const sameSite =
        (sameSiteEnv as 'lax' | 'strict' | 'none' | undefined) ||
        'lax'; // More permissive for refresh tokens

    return {
        httpOnly: true,
        secure,
        sameSite,
        domain: domain || undefined,
        path: '/', // Allow refresh from any endpoint
    } as const;
}

/**
 * Legacy function for backward compatibility - now returns access token options
 */
export function getCookieOptions()
{
    return getAccessTokenCookieOptions();
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
    //   maxAge: 365 * 24 * 60 * 60 * 1000,  // 1 year (default to
    //   eternal)
} as const;