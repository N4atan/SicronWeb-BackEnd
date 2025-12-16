import { Request, Response } from 'express'

import { Product } from '../entities/Product'
import { UserRole } from '../entities/User'

import { ProductRepository } from '../repositories/ProductRepository'

export class ProductController {
    private static productRepository = new ProductRepository()

    static async create(req: Request, res: Response): Promise<Response> {
        if (!req.user)
            return res.status(401).end()

        if (
            req.user.role !== UserRole.ADMIN &&
            req.user.role !== UserRole.SUPPLIER_ADMIN
        )
            return res.status(403).end()

        const supplier = req.supplier
        if (!supplier)
            return res.status(404).json({ message: 'Supplier não encontrado' })

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
            category,
            active: true,
            supplier
        })

        const created = await this.productRepository.createAndSave(product)
        return res.status(201).location(`/products/${created.uuid}`).send()
    }

    static async query(req: Request, res: Response): Promise<Response> {
        const filters: any = {}
        const { name, category, active } = req.query

        if (name)     filters.name = String(name)
        if (category) filters.category = String(category)
        if (active !== undefined) filters.active = active === 'true'

        const list = await this.productRepository.findAll({ where: filters })
        return res.status(200).json({ products: list })
    }

    static async update(req: Request, res: Response): Promise<Response> {
        const product = req.product
        if (!product)
            return res.status(404).end()

        if (
            req.user!.role !== UserRole.ADMIN &&
            req.user!.uuid !== product.supplier.owner.uuid
        )
            return res.status(403).end()

        const {
            name,
            description,
            category,
            active
        } = req.body

        if (name)        product.name = name
        if (description) product.description = description
        if (category)    product.category = category
        if (active !== undefined) product.active = !!active

        await this.productRepository.save(product)
        return res.status(204).end()
    }

    static async delete(req: Request, res: Response): Promise<Response> {
        const product = req.product
        if (!product)
            return res.status(404).end()

        if (
            req.user!.role !== UserRole.ADMIN &&
            req.user!.uuid !== product.supplier.owner.uuid
        )
            return res.status(403).end()

        await this.productRepository.remove(product)
        return res.status(204).end()
    }
}
