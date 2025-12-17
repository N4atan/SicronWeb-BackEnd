import {Request, Response} from 'express';

import {Product} from '../entities/Product';
import {UserRole} from '../entities/User';
import {ProductRepository} from '../repositories/ProductRepository';

/**
 * Controller for managing global Product definitions.
 */
export class ProductController
{
    private static productRepository = new ProductRepository();

    /**
     * Creates a new Product (Admin only).
     *
     * @param req - Express Request object containing product details.
     * @param res - Express Response object.
     * @returns Promise<Response> - The created Product or error.
     */
    static async create(req: Request, res: Response):
        Promise<Response>
    {
        if (req.user?.role !== UserRole.ADMIN)
            return res.status(403).end();

        const {name, description, category} = req.body;

        if (!name || !category)
            return res.status(400).json(
                {message: 'Campos obrigatórios'});

        const product = new Product({
            name,
            description,
            category,
        });

        const created =
            await this.productRepository.createAndSave(product);
        return res.status(201)
            .location(`/products/${created.name}`)
            .send();
    }

    /**
     * Queries Products based on filters.
     *
     * @param req - Express Request object containing query filters.
     * @param res - Express Response object.
     * @returns Promise<Response> - List of Products matching
     *     criteria.
     */
    static async query(req: Request, res: Response): Promise<Response>
    {
        const filters: Record<string, unknown> = {};
        const {name, category, description} = req.query;

        if (name) filters.name = String(name);
        if (category) filters.category = String(category);
        if (description) filters.description = String(description);

        const list =
            await this.productRepository.findAll({where: filters});
        return res.status(200).json({products: list});
    }

    /**
     * Updates a Product's details.
     *
     * @param req - Express Request object containing updates.
     * @param res - Express Response object.
     * @returns Promise<Response> - 204 No Content or error.
     */
    static async update(req: Request, res: Response):
        Promise<Response>
    {
        const product = req.product!;

        const {name, description, category} = req.body;

        if (name) product.name = name;
        if (description) product.description = description;
        if (category) product.category = category;

        await this.productRepository.save(product);
        return res.status(204).end();
    }

    /**
     * Deletes a Product.
     *
     * @param req - Express Request object.
     * @param res - Express Response object.
     * @returns Promise<Response> - 204 No Content.
     */
    static async delete(req: Request, res: Response):
        Promise<Response>
    {
        await this.productRepository.remove(req.product!.name);
        return res.status(204).end();
    }
}
