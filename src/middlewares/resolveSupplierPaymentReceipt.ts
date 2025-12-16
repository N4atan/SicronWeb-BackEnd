import { Request, Response, NextFunction } from 'express';

import { SupplierPaymentReceiptRepository } from '../repositories/SupplierPaymentReceiptRepository';

const repo = new SupplierPaymentReceiptRepository();

export async function resolveSupplierPaymentReceipt(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { uuid } = req.params
  if (!uuid)
    return res.status(400).json({ message: 'UUID ausente' })

  const receipt = await repo.findByUUID(uuid)
  if (!receipt)
    return res.status(404).json({ message: 'Recibo de pagamento não encontrado' })

  req.paymentReceipt = receipt
  next()
}
