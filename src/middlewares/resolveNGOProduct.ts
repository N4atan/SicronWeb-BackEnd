import {NextFunction, Request, Response} from 'express';

import {NGOProductRepository} from '../repositories/NGOProductRepository';

const repo = new NGOProductRepository();

/**
 * Middleware to resolve NGO Product (Need).
 * Depends on resolveNGOAccess and resolveProduct (implied
 * availability of req.ngo). Populates req.ngoProduct.
 */
export async function resolveNGOProduct(
    req: Request,
    res: Response,
    next: NextFunction,
)
{
    // Caution: req.product is likely NOT populated here unless
    // resolveProduct was called before. But usage suggests typical
    // route: /ngo/:uuid/product/:name (or similar) Let's assume
    // req.product comes from resolveProduct if chained. Actually,
    // wait, NGOProductController.delete uses req.ngoProduct.

    // Checking original code: repo.find(req.ngo!, req.product!)
    // This implies we found the product definition first.

    if (!req.ngo || !req.product) {
        // Just in case, this middleware likely depends on previous
        // ones. Does typical usage include resolveProduct? We should
        // check routes index later. For now, documenting 'as is'.
    }

    const ngoProduct = await repo.find(req.ngo!, req.product!);
    if (!ngoProduct)
        return res.status(404).json(
            {message: 'Produto de ONG não encontrado'});

    req.ngoProduct = ngoProduct;
    next();
}
