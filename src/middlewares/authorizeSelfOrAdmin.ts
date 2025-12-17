import {NextFunction, Request, Response} from 'express';

import {User, UserRole} from '../entities/User';
import {UserRepository} from '../repositories/UserRepository';

const userRepo = new UserRepository();

/**
 * Middleware to ensure the request is performed by the target user
 * themselves OR an Admin. Used for operations where a user modifies
 * their own data.
 */
export async function authorizeSelfOrAdmin(
    req: Request,
    res: Response,
    next: NextFunction,
)
{
    const user: User = req.user!;
    const paramId = req.params.uuid;

    let target: User|null = null;

    if (paramId) {
        target = await userRepo.findByUUID(paramId);
    }
    else {
        target = req.user!;
    }

    if (!target && user.role !== UserRole.ADMIN) {
        return res.status(403).json({message: 'Permissão negada!'});
    }

    if (!target) {
        return res.status(404).json(
            {message: 'O usuário alvo não foi encontrado!'});
    }

    if (!req.logged ||
        (user.role !== UserRole.ADMIN && user.id !== target.id)) {
        return res.status(403).json({message: 'Permissão negada!'});
    }

    if (!target?.id) {
        return res.status(404).json(
            {message: 'O usuário alvo não foi encontrado!'});
    }

    req.target = target;
    next();
}
