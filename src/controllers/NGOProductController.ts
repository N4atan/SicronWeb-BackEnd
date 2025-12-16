import { Request, Response } from 'express'

import { NGOProduct } from '../entities/NGOProduct';
import { UserRole } from '../entities/User';

import { NGOProductRepository } from '../repositories/NGOProductRepository';
import { ProductRepository } from '../repositories/ProductRepository';

export class NGOProductController {
    private static ngoProductRepository = new NGOProductRepository()
    private static productRepository = new ProductRepository()

    static async create(req: Request, res: Response): Promise<Response> {
        const {
            name,
            quantity,
            notes
        } = req.body

        if (!name || quantity === undefined)
            return res.status(400).json({ message: 'Campos obrigatórios' })

        const product = await NGOProductController.productRepository.findByName(name)
        if (!product)
            return res.status(404).json({ message: 'Produto não encontrado' })

        const exists = await NGOProductController.ngoProductRepository.find(req.ngo!, product);

        if (exists)
            return res.status(409).json({ message: 'Produto já registrado nesta ONG' })

        const ngoProduct = new NGOProduct({
            ngo: req.ngo!,
            product,
            quantity,
            notes
        })

        const created = await NGOProductController.ngoProductRepository.createAndSave(ngoProduct)
        return res.status(201).json(created)
    }

    static async update(req: Request, res: Response): Promise<Response> {
        const ngoProduct = req.ngoProduct!

        const { quantity, notes } = req.body

        if (quantity !== undefined)
            ngoProduct.quantity = quantity

        if (notes !== undefined)
            ngoProduct.notes = notes

        await NGOProductController.ngoProductRepository.save(ngoProduct)
        return res.status(204).end()
    }

    static async delete(req: Request, res: Response): Promise<Response> {
        // req.ngoProduct is populated by middleware
        await NGOProductController.ngoProductRepository.removeById(req.ngoProduct!.id)
        return res.status(204).end()
    }
}
