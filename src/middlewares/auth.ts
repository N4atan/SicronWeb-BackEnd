import { Request, Response, NextFunction } from "express";

import { TokenService   } from "../services/TokenService";
import { UserRepository } from "../repositories/UserRepository";

const userRepo = new UserRepository();

export async function auth(req: Request, res: Response, next: NextFunction)
{
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) return res.status(401).json({ message: "Autentificação necessária!" });

        const payload: any = TokenService.verifyAccess(accessToken);
        if (!payload?.id) return res.status(401).json({ message: "Dados de autentificação inválidos!"});

        const user = await userRepo.findById(payload.id);
        if (!user?.id) return res.status(401).json({ message: "Dados de autentificação apontam para usuário inexistente!" });

        req.body.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Dados de autentificação inválidos ou expirados!" });
    }
}