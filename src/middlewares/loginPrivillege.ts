import { Request, Response, NextFunction } from "express";

import { User, UserRole } from "../entities/User";

import { UserRepository } from "../repositories/UserRepository";

const userRepo = new UserRepository();

export async function loginPrivillege(req: Request, res: Response, next: NextFunction)
{
    try {
	    const user:   User = req.user!;
	    const target = (req.params.uuid ? await userRepo.findByUUID(req.params.uuid) : req.user!);

        if (!target && user.role !== UserRole.ADMIN)
            return res.status(403).json({ message: "Permissão negada!" });
        if (!target)
            return res.status(404).json({ message: "O usuário alvo não foi encontrado!" });

        if (!req.logged || ((user.role !== UserRole.ADMIN && user.id !== target.id)))
                return res.status(403).json({ message: "Permissão negada!" });
	    if (!target?.id)
                return res.status(404).json({ message: "O usuário alvo não foi encontrado!" });
	
	    req.target = target;
	    next();	
    } catch (e) {
	    console.error(`---> AUTH ERR: ${e}`);
        return res.status(401).json({ message: "Dados de autentificação inválidos ou expirados!" });
    }
}
