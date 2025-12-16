import { Request, Response, NextFunction } from 'express'
import { NGOProductRepository } from '../repositories/NGOProductRepository'


const repo = new NGOProductRepository()

export async function resolveNGOProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const ngoProduct = await repo.find(req.ngo!, req.product!)
  if (!ngoProduct)
    return res.status(404).json({ message: 'Produto de ONG não encontrado' })

  req.ngoProduct = ngoProduct
  next()
}
