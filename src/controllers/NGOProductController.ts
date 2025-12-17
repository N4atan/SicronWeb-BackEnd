import {Request, Response} from 'express';

import {NGOProduct} from '../entities/NGOProduct';
import {NGOProductRepository} from '../repositories/NGOProductRepository';
import {ProductRepository} from '../repositories/ProductRepository';

/**
 * Controller for managing Products registered to an NGO (Needs).
 */
export class NGOProductController
{
    private static ngoProductRepository = new NGOProductRepository();
    private static productRepository = new ProductRepository();

    /**
     * Registers a product need for the NGO.
     *
     * @param req - Express Request object containing product name,
     *     quantity, and notes.
     * @param res - Express Response object.
     * @returns Promise<Response> - 201 Created or error.
     */
    static async create(req: Request, res: Response):
        Promise<Response>
    {
        const {name, quantity, notes} = req.body;

        if (!name || quantity === undefined)
            return res.status(400).json(
                {message: 'Campos obrigatórios'});

        const product = await this.productRepository.findByName(name);
        if (!product)
            return res.status(404).json(
                {message: 'Produto não encontrado'});

        const exists =
            await this.ngoProductRepository.find(req.ngo!, product);

        if (exists)
            return res.status(409).json(
                {message: 'Produto já registrado nesta ONG'});

        const ngoProduct = new NGOProduct({
            ngo: req.ngo!,
            product,
            quantity,
            notes,
        });

        await this.ngoProductRepository.createAndSave(ngoProduct);
        return res.status(201).end();
    }

    /**
     * Updates an NGO Product need.
     *
     * @param req - Express Request object containing updates
     *     (quantity, notes).
     * @param res - Express Response object.
     * @returns Promise<Response> - 204 No Content.
     */
    static async update(req: Request, res: Response):
        Promise<Response>
    {
        const ngoProduct = req.ngoProduct!;

        const {quantity, notes} = req.body;

        if (quantity !== undefined) ngoProduct.quantity = quantity;

        if (notes !== undefined) ngoProduct.notes = notes;

        await this.ngoProductRepository.save(ngoProduct);
        return res.status(204).end();
    }

    /**
     * Removes a product need from the NGO.
     *
     * @param req - Express Request object.
     * @param res - Express Response object.
     * @returns Promise<Response> - 204 No Content.
     */
    static async delete(req: Request, res: Response):
        Promise<Response>
    {
        await this.ngoProductRepository.remove(
            req.ngo!, req.ngoProduct!.product);
        return res.status(204).end();
    }
}
