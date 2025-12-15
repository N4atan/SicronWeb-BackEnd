import { Request, Response, NextFunction } from "express";

import { User, UserRole } from "../entities/User";

import { UserRepository } from "../repositories/UserRepository";

const userRepo = new UserRepository();

export async function loginPrivillege(req: Request, res: Response, next: NextFunction) {
    try {
        // console.log(`[DEBUG] loginPrivillege called. Params:`, req.params);
        const user: User = req.user!;
        const paramId = req.params.uuid;

        let target: User | null = null;

        if (paramId) {
            // Se for número, busca por ID (Legacy support)
            if (!isNaN(Number(paramId))) {
                console.log(`[DEBUG] loginPrivillege searching by ID: ${paramId}`);
                target = await userRepo.findById(Number(paramId));
            } else {
                // Senão, assume UUID
                console.log(`[DEBUG] loginPrivillege searching by UUID: ${paramId}`);
                target = await userRepo.findByUUID(paramId);
            }
        } else {
            // Se não veio parametro, o alvo sou eu mesmo
            // console.log(`[DEBUG] loginPrivillege default target (self)`);
            target = req.user!;
        }

        if (!target && user.role !== UserRole.ADMIN) {
            console.log(`[DEBUG] loginPrivillege failed: Target not found and not admin.`);
            return res.status(403).json({ message: "Permissão negada!" });
        }

        if (!target) {
            console.log(`[DEBUG] loginPrivillege failed: Target not found.`);
            return res.status(404).json({ message: "O usuário alvo não foi encontrado!" });
        }


        if (!req.logged || ((user.role !== UserRole.ADMIN && user.id !== target.id))) {
            console.log(`[DEBUG] loginPrivillege failed logic: logged=${req.logged}, role=${user.role}, userId=${user.id}, targetId=${target.id}`);
            return res.status(403).json({ message: "Permissão negada!" });
        }

        if (!target?.id) {
            console.log(`[DEBUG] loginPrivillege failed: bad target object.`);
            return res.status(404).json({ message: "O usuário alvo não foi encontrado!" });
        }

        req.target = target;
        console.log(`[DEBUG] loginPrivillege success. Target set to: ${target.id}`);
        next();
    } catch (e) {
        console.error(`---> AUTH ERR: ${e}`);
        return res.status(401).json({ message: "Dados de autentificação inválidos ou expirados!" });
    }
}
