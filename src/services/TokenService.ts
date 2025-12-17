import jwt, {Secret, SignOptions} from 'jsonwebtoken';

import {ENV} from '../config/env';

/**
 * Represents a pair of JWT tokens (access and refresh).
 */
export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}

export interface UserPayload {
    id: string;  // User UUID
    email?: string;
    [key: string]: unknown;
}

/**
 * Service for generating and verifying JWT tokens.
 */
export class TokenService
{
    /**
     * Generates an access and refresh token pair.
     *
     * @param payload - User payload (must include id/uuid).
     * @returns TokenPair - Object containing accessToken and
     *     refreshToken.
     */
    static generateTokenPair(payload: UserPayload): TokenPair
    {
        const accessToken = jwt.sign(
            payload,
            ENV.JWT_ACCESS_SECRET as Secret,
            {
                expiresIn: ENV.JWT_ACCESS_EXPIRES,
            } as SignOptions,
        );

        const refreshToken = jwt.sign(
            {id: payload.id},
            ENV.JWT_REFRESH_SECRET as Secret,
            {
                expiresIn: ENV.JWT_REFRESH_EXPIRES,
            } as SignOptions,
        );

        return {accessToken, refreshToken};
    }

    /**
     * Verifies an access token.
     *
     * @param token - The JWT access token string.
     * @returns string | jwt.JwtPayload - Decoded payload or throws
     *     error.
     */
    static verifyAccess(token: string): string|jwt.JwtPayload
    {
        return jwt.verify(token, ENV.JWT_ACCESS_SECRET as Secret);
    }

    /**
     * Verifies a refresh token.
     *
     * @param token - The JWT refresh token string.
     * @returns string | jwt.JwtPayload - Decoded payload or throws
     *     error.
     */
    static verifyRefresh(token: string): string|jwt.JwtPayload
    {
        return jwt.verify(token, ENV.JWT_REFRESH_SECRET as Secret);
    }
}
