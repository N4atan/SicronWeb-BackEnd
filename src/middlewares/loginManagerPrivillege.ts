import { Request, Response, NextFunction } from "express";

import { TokenService  } from "../services/TokenService";
import { UserRole      } from "../repositories/UserRepository";
import { NGOController } from "../repositories/NGORepository";

const ngoRepo = new NGORepository();

export async function loginManagerPrivillege(req: Request, res: Response, next: NextFunction)
{
    try {
	const user:   User = req.body.user;
	const target: User = req.params.uuid ? await ngoRepo.findByUUID(req.params.uuid) : null;

        if (!req.body.logged || ((user.role !== UserRole.ADMIN && user.uuid !== target?.manager_uuid)))
                return res.status(403).json({ message: "Permissão negada!" });
	if (!target?.id)
                return res.status(404).json({ message: "A ONG alvo não foi encontrada!" });
	
	req.body.target = target;
	next();	
    } catch (e) {
	console.error(`---> AUTH ERR: ${e}`);
        return res.status(401).json({ message: "Dados de autentificação inválidos ou expirados!" });
    }
}
