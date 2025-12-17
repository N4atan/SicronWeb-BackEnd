/**
 * Cookie names used in the application.
 */
export const COOKIE_NAMES = {
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
};

/**
 * Token expiration times in milliseconds.
 */
export const TOKEN_EXPIRATION = {
    ACCESS_TOKEN: 15 * 60 * 1000,            // 15 Minutes
    REFRESH_TOKEN: 7 * 24 * 60 * 60 * 1000,  // 7 Days
};

/**
 * Standard cookie options for security.
 */
export const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,
    sameSite: 'strict' as const,
};
