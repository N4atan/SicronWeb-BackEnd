import { Request, Response, NextFunction } from 'express'

import { UserRole } from '../entities/User'
import { NGORepository } from '../repositories/NGORepository'

const ngoRepo = new NGORepository()

export async function resolveNGOAccess(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const user = req.user!
        if (!user)
            return res.status(401).json({ message: 'Não autenticado' })

        const { uuid } = req.params;
        const ngo = uuid ? await ngoRepo.findByUUID(uuid) : user.managedNGO;
        if (!ngo)
            return res.status(404).json({ message: 'ONG não encontrada' })

        if (user.role === UserRole.ADMIN) {
            req.ngo = ngo
            return next()
        }

        const isManager = ngo.manager.uuid === user.uuid
        const isEmployee = user.employedNGOs?.some(n => n.uuid === ngo.uuid)

        if (!isManager && !isEmployee)
            return res.status(403).json({ message: 'Permissão negada' })

        req.ngo = ngo
        next()
    } catch (err) {
        console.error('NGO TARGET ERROR:', err)
        return res.status(500).json({ message: 'Erro interno' })
    }
}
