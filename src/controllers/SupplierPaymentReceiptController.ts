import { Request, Response } from 'express'

import { UserRole } from '../entities/User'
import { SupplierPaymentReceipt } from '../entities/SupplierPaymentReceipt'

import { SupplierPaymentReceiptRepository } from '../repositories/SupplierPaymentReceiptRepository'
import { SupplierRepository } from '../repositories/SupplierRepository'

export class SupplierPaymentReceiptController {
  private static receiptRepository = new SupplierPaymentReceiptRepository()
  private static supplierRepository = new SupplierRepository()

  static async create(req: Request, res: Response): Promise<Response> {
    if (!req.user)
      return res.status(401).end()

    const { supplier_uuid, fileUrl, amount } = req.body

    if (!supplier_uuid || !fileUrl || amount === undefined)
      return res.status(400).json({ message: 'Campos obrigatórios' })

    const supplier = await this.supplierRepository.findByUUID(supplier_uuid)
    if (!supplier)
      return res.status(404).json({ message: 'Fornecedor não encontrado' })

    if (
      req.user!.role !== UserRole.ADMIN &&
      (!req.ngo || req.user.uuid !== req.ngo.manager.uuid)
    )
      return res.status(403).json({ message: 'Permissão negada' })

    const receipt = new SupplierPaymentReceipt({
      supplier,
      fileUrl,
      amount
    })

    await this.receiptRepository.createAndSave(receipt)
    return res.status(201).location(`/payments/${receipt.uuid}`).send()
  }

  static async query(req: Request, res: Response): Promise<Response> {
    if (!req.user)
      return res.status(401).end()

    const { supplier_uuid } = req.query
    const filters: any = {}

    if (supplier_uuid)
      filters.supplier = { uuid: String(supplier_uuid) }

    if (req.user!.role === UserRole.ADMIN)
      return res.status(200).json({ payments: await this.receiptRepository.findAll({ where: filters }) });

    if (req.user!.role === UserRole.NGO_MANAGER || req.user!.role === UserRole.NGO_EMPLOYER) {
      if (!req.ngo)
        return res.status(400).json({ message: 'Nenhuma ONG associada à sessão' })
      filters.ngo = { uuid: req.ngo.uuid };
      const payments = await this.receiptRepository.findAll({ where: filters });
      return res.status(200).json({ payments });
    }

    if (req.user!.role === UserRole.SUPPLIER_ADMIN || req.user!.role === UserRole.SUPPLIER_EMPLOYER) {
      const supplier = await this.supplierRepository.findByUserUUID(req.user!.uuid);
      if (!supplier)
        return res.status(404).json({ message: 'Fornecedor não encontrado' });
      filters.supplier = { uuid: supplier.uuid };
      const payments = await this.receiptRepository.findAll({ where: filters });
      return res.status(200).json({ payments });
    }

    return res.status(403).json({ message: 'Permissão negada' })
  }

  static async delete(req: Request, res: Response): Promise<Response> {
    await this.receiptRepository.remove(req.paymentReceipt!);
    return res.status(204).end()
  }
}
