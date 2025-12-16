import { Request, Response, NextFunction } from 'express';

import { ProductRepository } from '../repositories/ProductRepository';

const repo = new ProductRepository();

export async function resolveProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name } = req.params
  if (!name)
    return res.status(400).json({ message: 'Nome ausente' })

  const product = await repo.findByName(name);
  if (!product)
    return res.status(404).json({ message: 'Produto não encontrado' })

  req.product = product
  next()
}
