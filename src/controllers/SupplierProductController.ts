import { Request, Response } from 'express';

import { SupplierProduct } from '../entities/SupplierProduct';
import { UserRole } from '../entities/User';

import { SupplierProductRepository } from '../repositories/SupplierProductRepository';
import { ProductRepository } from '../repositories/ProductRepository';

export class SupplierProductController {
    private static supplierProductRepository = new SupplierProductRepository()
    private static productRepository = new ProductRepository()

    static async create(req: Request, res: Response): Promise<Response> {
        const {
            name,
            price,
            availableQuantity,
            avgDeliveryTimeDays
        } = req.body

        if (!name || price === undefined || availableQuantity === undefined || !avgDeliveryTimeDays)
            return res.status(400).json({ message: 'Campos obrigatórios' })

        const product = await SupplierProductController.productRepository.findByName(name)
        if (!product)
            return res.status(404).json({ message: 'Produto não encontrado' })

        const exists = await SupplierProductController.supplierProductRepository.find(req.supplier!, product);
        if (exists)
            return res.status(409).json({ message: 'Produto já ofertado por este fornecedor' })

        const supplierProduct = new SupplierProduct({
            supplier: req.supplier!,
            product,
            price,
            availableQuantity,
            avgDeliveryTimeDays
        })

        const created = await SupplierProductController.supplierProductRepository.createAndSave(supplierProduct)
        return res.status(201).json(created)
    }

    static async update(req: Request, res: Response): Promise<Response> {
        const supplierProduct = req.supplierProduct!;

        const {
            price,
            availableQuantity,
            avgDeliveryTimeDays
        } = req.body

        if (price !== undefined)
            supplierProduct.price = price

        if (availableQuantity !== undefined)
            supplierProduct.availableQuantity = availableQuantity

        if (avgDeliveryTimeDays)
            supplierProduct.avgDeliveryTimeDays = avgDeliveryTimeDays

        await SupplierProductController.supplierProductRepository.save(supplierProduct)
        return res.status(204).end()
    }

    static async delete(req: Request, res: Response): Promise<Response> {
        await SupplierProductController.supplierProductRepository.removeById(req.supplierProduct!.id)
        return res.status(204).end()
    }
}
