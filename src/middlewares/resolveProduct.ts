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

  // Repo needs findByUUID or use direct repository access if possible, but let's stick to repo pattern
  // Adding findByUUID to repo in next step, or using casting if findByUUID exists (it doesnt yet)
  // Let's assume we will add findByUUID to repo.
  const product = await repo.findByUUID(uuid);

  if (!product)
    return res.status(404).json({ message: 'Produto não encontrado' })

  req.product = product
  next()
}
