import { Request, Response } from 'express'

import { UserRole } from '../entities/User'
import { UserDonationReceipt } from '../entities/UserDonationReceipt'
import { UserDonationItem } from '../entities/UserDonationItem'

import { UserDonationReceiptRepository } from '../repositories/UserDonationReceiptRepository'
import { NGORepository } from '../repositories/NGORepository'
import { ProductRepository } from '../repositories/ProductRepository'
import { NGOProductRepository } from '../repositories/NGOProductRepository'
import { NGOProductController } from './NGOProductController'

export class UserDonationReceiptController {
  private static receiptRepository = new UserDonationReceiptRepository()
  private static ngoRepository = new NGORepository()
  private static productRepository = new ProductRepository()
  private static ngoProductRepository = new NGOProductRepository()

  static async create(req: Request, res: Response): Promise<Response> {
    const { ngo_uuid, fileUrl, items } = req.body; // items: [{ product_uuid, quantity }]

    if (!ngo_uuid || !fileUrl || !items || !Array.isArray(items) || items.length === 0)
      return res.status(400).json({ message: 'Campos obrigatórios: ngo_uuid, fileUrl e items (array)' });

    let ngo = req.ngo;
    if (!ngo && ngo_uuid) {
      ngo = await UserDonationReceiptController.ngoRepository.findByUUID(ngo_uuid) || undefined;
    }

    if (!ngo)
      return res.status(404).json({ message: 'ONG não encontrada' });

    // 1. Create the Receipt (Header)
    const receipt = new UserDonationReceipt({
      user: req.user!,
      ngo,
      fileUrl,
      amount: 0
    });

    const savedReceipt = await UserDonationReceiptController.receiptRepository.createAndSave(receipt);

    // 2. Process Items
    const donationItems = [];

    for (const item of items) {
      const { product_uuid, quantity } = item;
      const qty = Number(quantity);

      if (!product_uuid || isNaN(qty) || qty <= 0) continue;

      const product = await UserDonationReceiptController.productRepository.findByUUID(product_uuid);
      if (!product) continue;

      // Update NGO Collected Quantity
      const ngoProduct = await UserDonationReceiptController.ngoProductRepository.find(ngo, product);
      if (ngoProduct) {
        ngoProduct.collected_quantity += qty;
        await UserDonationReceiptController.ngoProductRepository.save(ngoProduct);
      }

      // Create Donation Item Linked to Receipt
      const donationItem = new UserDonationItem({
        product: product,
        quantity: qty,
        donationReceipt: savedReceipt
      });

      // We'll save using a repository directly or rely on cascade if we added items to receipt before save.
      // Since we already saved receipt, let's just save items. 
      // Note: We need a UserDonationItemRepository or generic repo. 
      // For simplicity, let's use the connection/manager or standard repository pattern if available.
      // Assuming we can use AppDataSource or similar, but avoiding new imports if possible.
      // Let's use the cascade update via receipt if possible, or save item directly.
      // To save item directly we need its repo. Let's add it via property in next step if needed,
      // OR simpler: append to receipt.items and save receipt again (cascade).

      donationItems.push(donationItem);
    }

    savedReceipt.items = donationItems;
    await UserDonationReceiptController.receiptRepository.save(savedReceipt);

    return res.status(201).location(`/donations/${savedReceipt.uuid}`).send();
  }


  static async query(req: Request, res: Response): Promise<Response> {
    const { ngo_uuid, user_uuid } = req.query
    const filters: any = {}

    if (ngo_uuid) filters.ngo = { uuid: String(ngo_uuid) }
    if (user_uuid) filters.user = { uuid: String(user_uuid) }

    if (req.user!.role === UserRole.ADMIN)
      return res.status(200).json({ donations: await this.receiptRepository.findAll({ where: filters }) })

    if (req.user!.role === UserRole.USER)
      filters.user = { uuid: req.user!.uuid }

    if (req.user!.role === UserRole.NGO_MANAGER || req.user!.role === UserRole.NGO_EMPLOYER)
      filters.ngo = { manager: { uuid: req.user!.uuid } }

    const donations = await this.receiptRepository.findAll({ where: filters })
    return res.status(200).json({ donations })
  }
}
