import {Request, Response} from 'express';

import {SupplierProduct} from '../entities/SupplierProduct';
import {ProductRepository} from '../repositories/ProductRepository';
import {SupplierProductRepository} from '../repositories/SupplierProductRepository';

/**
 * Controller for managing Products offered by a Supplier.
 */
export class SupplierProductController
{
    private static supplierProductRepository =
        new SupplierProductRepository();
    private static productRepository = new ProductRepository();

    /**
     * Registers a product offer for the Supplier.
     *
     * @param req - Express Request object containing product offer
     *     details.
     * @param res - Express Response object.
     * @returns Promise<Response> - 201 Created or error.
     */
    static async create(req: Request, res: Response):
        Promise<Response>
    {
        const {name, price, availableQuantity, avgDeliveryTimeDays} =
            req.body;

        if (!name || price === undefined ||
            availableQuantity === undefined || !avgDeliveryTimeDays)
            return res.status(400).json(
                {message: 'Campos obrigatórios'});

        const product = await this.productRepository.findByName(name);
        if (!product)
            return res.status(404).json(
                {message: 'Produto não encontrado'});

        const exists = await this.supplierProductRepository.find(
            req.supplier!,
            product,
        );
        if (exists)
            return res.status(409).json(
                {message: 'Produto já ofertado por este fornecedor'});

        const supplierProduct = new SupplierProduct({
            supplier: req.supplier!,
            product,
            price,
            availableQuantity,
            avgDeliveryTimeDays,
        });

        await this.supplierProductRepository.createAndSave(
            supplierProduct);
        return res.status(201).end();
    }

    /**
     * Updates a Supplier's product offer.
     *
     * @param req - Express Request object containing updates (price,
     *     qty, delivery time).
     * @param res - Express Response object.
     * @returns Promise<Response> - 204 No Content.
     */
    static async update(req: Request, res: Response):
        Promise<Response>
    {
        const supplierProduct = req.supplierProduct!;

        const {price, availableQuantity, avgDeliveryTimeDays} =
            req.body;

        if (price !== undefined) supplierProduct.price = price;

        if (availableQuantity !== undefined)
            supplierProduct.availableQuantity = availableQuantity;

        if (avgDeliveryTimeDays)
            supplierProduct.avgDeliveryTimeDays = avgDeliveryTimeDays;

        await this.supplierProductRepository.save(supplierProduct);
        return res.status(204).end();
    }

    /**
     * Removes a product offer from the Supplier.
     *
     * @param req - Express Request object.
     * @param res - Express Response object.
     * @returns Promise<Response> - 204 No Content.
     */
    static async delete(req: Request, res: Response):
        Promise<Response>
    {
        const supplierProduct = req.supplierProduct!;
        await this.supplierProductRepository.remove(
            req.supplier!,
            supplierProduct.product,
        );
        return res.status(204).end();
    }
}
