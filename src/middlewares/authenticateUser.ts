import { Request, Response, NextFunction } from 'express'

import { RefreshService } from '../services/RefreshService'
import { TokenService } from '../services/TokenService';
import { UserRepository } from '../repositories/UserRepository';
import { UserRole } from '../entities/User';

const userRepo = new UserRepository();

export function authenticateUser(
    required: boolean = false,
    roles?: UserRole[] | undefined | null
) {
    return async (req: Request, res: Response, next: NextFunction) => {
        req.user = null
        req.logged = false

        try {
            const accessToken  = req.cookies?.accessToken
            const refreshToken = req.cookies?.refreshToken

            if (!accessToken)
                return required ? res.status(401).end() : next()

            const payload: any = TokenService.verifyAccess(accessToken)
            if (!payload?.id)
                return required ? res.status(401).end() : next()

            const user = await userRepo.findByUUID(payload.id)
            if (!user?.id)
                return required ? res.status(401).end() : next()

            if (payload.email !== user.email)
                return required ? res.status(401).end() : next()

            if (!RefreshService.isValid(user.id, refreshToken, req.ip))
                return required ? res.status(401).end() : next()

            if (roles && !roles.includes(user.role))
                return res.status(403).end()

            req.user   = user
            req.logged = true

            next()
        } catch {
            return required ? res.status(401).end() : next()
        }
    }
}
