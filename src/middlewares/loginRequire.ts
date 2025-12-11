import { Request, Response, NextFunction } from "express";

import { UserRepository } from "../repositories/UserRepository";

const userRepo = new UserRepository();

export async function loginRequire(req: Request, res: Response, next: NextFunction)
{
    if (!req.logged || !req.user)
	    return res.status(401).json({ message: "Dados de autentificação não fornecidos, inválidos ou expirados!" });
    next();
}