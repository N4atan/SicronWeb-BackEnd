import { Request, Response, NextFunction } from "express";

import { User } from "../entities/User";

import { RefreshService } from "../services/RefreshService";
import { TokenService   } from "../services/TokenService";

import { UserRepository } from "../repositories/UserRepository";

const userRepo = new UserRepository();

export async function loginChecker(req: Request, res: Response, next: NextFunction)
{
    req.user = null;
    req.logged = false;
    
    try {
        const token = req.cookies.accessToken;
	if (!token) return next();

        const payload: any = TokenService.verifyAccess(token);
	if (!payload?.id) return next(); 

        const user = await userRepo.findById(payload.id);
        if (!user?.id) return next(); 
	
	if (!RefreshService.isValid(user.id, req.cookies.refreshToken, req.ip)) return next();

        req.user   = user;
	req.logged = true; 
        next();
    } catch {
        next();
    }
}
