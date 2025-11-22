import jwt from "jsonwebtoken";

import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, JWT_ACCESS_EXPIRES, JWT_REFRESH_EXPIRES } from "../config/jwt";

interface TokenPair
{
    accessToken: string;
    refreshToken: string;
}

export class TokenService
{
    static generateTokenPair(payload: any): TokenPair
    {
        const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, {
            expiresIn: JWT_ACCESS_EXPIRES
        });

        const refreshToken = jwt.sign({ id: payload.id }, JWT_REFRESH_SECRET, {
            expiresIn: JWT_REFRESH_EXPIRES
        });

        return { accessToken, refreshToken };
    }

    static verifyAccess(token: string): string
    {
        return jwt.verify(token, JWT_ACCESS_SECRET);
    }

    static verifyRefresh(token: string): string
    {
        return jwt.verify(token, JWT_REFRESH_SECRET);
    }
}