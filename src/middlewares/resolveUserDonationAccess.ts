import { Request, Response, NextFunction } from 'express'
import { UserRole } from '../entities/User'

export async function resolveUserDonationAccess(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = req.user
  const receipt = req.donationReceipt

  if (!user)
    return res.status(401).end()
  if (!receipt)
    return res.status(404).json({ message: 'Recibo não encontrado' })

  const isAdmin = user.role === UserRole.ADMIN
  const isDonor = receipt.user.uuid === user.uuid
  const isNGOManager = receipt.ngo.manager.uuid === user.uuid
  const isNGOEmployee = user.employedNGOs?.some(n => n.uuid === receipt.ngo.uuid)

  if (!isAdmin && !isDonor && !isNGOManager && !isNGOEmployee)
    return res.status(403).json({ message: 'Permissão negada' })

  next()
}
