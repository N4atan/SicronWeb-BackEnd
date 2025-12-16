import { Request, Response, NextFunction } from 'express'
import { UserRole } from '../entities/User'
import { SupplierRepository } from '../repositories/SupplierRepository'

const repo = new SupplierRepository()

export async function resolveSupplierAccess(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = req.user
  if (!user)
    return res.status(401).end()

  const { uuid } = req.params
  if (!uuid)
    return res.status(400).json({ message: 'UUID ausente' })

  const supplier = await repo.findByUUID(uuid)
  if (!supplier)
    return res.status(404).json({ message: 'Fornecedor não encontrado' })

  const isAdmin = user.role === UserRole.ADMIN
  const isOwner = supplier.manager.uuid === user.uuid
  const isEmployee = user.employedSuppliers?.some(s => s.uuid === supplier.uuid)

  if (!isAdmin && !isOwner && !isEmployee)
    return res.status(403).json({ message: 'Permissão negada' })

  req.supplier = supplier
  next()
}
