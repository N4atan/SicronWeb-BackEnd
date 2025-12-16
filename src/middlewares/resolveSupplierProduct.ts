import { Request, Response, NextFunction } from 'express'
import { SupplierProductRepository } from '../repositories/SupplierProductRepository'

const repo = new SupplierProductRepository()

export async function resolveSupplierProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const param = req.params.id || req.params.uuid;
  const id = Number(param);

  if (isNaN(id)) {
    return res.status(400).json({ message: 'ID inválido para produto de fornecedor' });
  }

  const supplierProduct = await repo.findById(id)

  if (!supplierProduct)
    return res.status(404).json({ message: 'Produto de fornecedor não encontrado' })

  // Security: Ensure it belongs to the authenticated supplier
  if (req.supplier && supplierProduct.supplier.uuid !== req.supplier.uuid) {
    return res.status(403).json({ message: 'Acesso negado a este produto' });
  }

  req.supplierProduct = supplierProduct
  next()
}
