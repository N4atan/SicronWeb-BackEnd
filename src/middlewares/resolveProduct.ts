import { Request, Response, NextFunction } from 'express';

import { ProductRepository } from '../repositories/ProductRepository';

const repo = new ProductRepository();

export async function resolveProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { uuid } = req.params
  if (!uuid)
    return res.status(400).json({ message: 'UUID ausente' })


  const product = await repo.findByUUID(uuid);

  if (!product)
    return res.status(404).json({ message: 'Produto não encontrado' })

  req.product = product
  next()
}
