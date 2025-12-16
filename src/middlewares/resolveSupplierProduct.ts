import { Request, Response, NextFunction } from 'express'
import { SupplierProductRepository } from '../repositories/SupplierProductRepository'

const repo = new SupplierProductRepository()

export async function resolveSupplierProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const supplierProduct = await repo.find(req.supplier!, req.product!)
  if (!supplierProduct)
    return res.status(404).json({ message: 'Produto de fornecedor não encontrado' })

  req.supplierProduct = supplierProduct
  next()
}
