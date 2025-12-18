import { Request, Response, NextFunction } from 'express'
import { NGOProductRepository } from '../repositories/NGOProductRepository'


const repo = new NGOProductRepository()

export async function resolveNGOProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const param = req.params.id || req.params.uuid; // Aceita tanto :id quanto :uuid para compatibilidade
  const id = Number(param);

  if (isNaN(id)) {

  }

  const ngoProduct = await repo.findById(id)

  if (!ngoProduct)
    return res.status(404).json({ message: 'Produto de ONG não encontrado' })

  // Security check: ensure the NGOProduct belongs to the authenticated NGO
  if (req.ngo && ngoProduct.ngo.uuid !== req.ngo.uuid) {
    return res.status(403).json({ message: 'Acesso negado a este produto' });
  }

  req.ngoProduct = ngoProduct
  next()
}
