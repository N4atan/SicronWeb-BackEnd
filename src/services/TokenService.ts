import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

import { 
    JWT_ACCESS_SECRET, 
    JWT_REFRESH_SECRET, 
    JWT_ACCESS_EXPIRES, 
    JWT_REFRESH_EXPIRES 
} from "../config/jwt";

interface TokenPair
{
    accessToken:  string;
    refreshToken: string;
}

export class TokenService
{
    static generateTokenPair(payload: any): TokenPair
    {
        const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET! as Secret, {
            expiresIn: JWT_ACCESS_EXPIRES! as string
        } as SignOptions);

        const refreshToken = jwt.sign({ id: payload.id }, JWT_REFRESH_SECRET! as Secret, {
            expiresIn: JWT_REFRESH_EXPIRES! as string
        } as SignOptions);

        return { accessToken, refreshToken };
    }

    static verifyAccess(token: string): string | JwtPayload
    {
        return jwt.verify(token, JWT_ACCESS_SECRET! as Secret);
    }

    static verifyRefresh(token: string): string | JwtPayload
    {
        return jwt.verify(token, JWT_REFRESH_SECRET! as Secret);
    }
}