import {NextFunction, Request, Response} from 'express';

import {SupplierProductRepository} from '../repositories/SupplierProductRepository';

const repo = new SupplierProductRepository();

/**
 * Middleware to resolve Supplier Product (Offer).
 * Requires resolveSupplierAccess (or req.supplier) and resolveProduct
 * (or req.product) to be populated. Populates req.supplierProduct.
 */
export async function resolveSupplierProduct(
    req: Request,
    res: Response,
    next: NextFunction,
)
{
    if (!req.supplier || !req.product) {
        // Should ensure previous middlewares ran.
    }

    const supplierProduct =
        await repo.find(req.supplier!, req.product!);
    if (!supplierProduct)
        return res.status(404).json(
            {message: 'Produto de fornecedor não encontrado'});

    req.supplierProduct = supplierProduct;
    next();
}
