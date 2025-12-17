import { Request, Response } from 'express'

import { Product } from '../entities/Product'
import { UserRole } from '../entities/User'

import { ProductRepository } from '../repositories/ProductRepository'

export class ProductController {
    private static productRepository = new ProductRepository()

    static async create(req: Request, res: Response): Promise<Response> {
        if (req.user?.role !== UserRole.ADMIN) return res.status(403).end()

        const {
            name,
            description,
            category
        } = req.body

        if (!name || !category)
            return res.status(400).json({ message: 'Campos obrigatórios' })

        const product = new Product({
            name,
            description,
            category
        })

        const created = await ProductController.productRepository.createAndSave(product)
        return res.status(201).location(`/products/${created.name}`).json(created)
    }

    static async query(req: Request, res: Response): Promise<Response> {
        const filters: any = {}
        const { name, category, description } = req.query

        if (name) filters.name = String(name)
        if (category) filters.category = String(category)
        if (description) filters.description = String(description);

        const list = await ProductController.productRepository.findAll({
            where: filters,
            relations: ['supplierProducts']
        })
        return res.status(200).json({ products: list })
    }

    static async update(req: Request, res: Response): Promise<Response> {
        const product = req.product!

        const {
            name,
            description,
            category,
            active
        } = req.body

        if (name) product.name = name
        if (description) product.description = description
        if (category) product.category = category

        await ProductController.productRepository.save(product)
        return res.status(204).end()
    }

    static async delete(req: Request, res: Response): Promise<Response> {
        await ProductController.productRepository.remove(req.product!.uuid)
        return res.status(204).end()
    }
}
