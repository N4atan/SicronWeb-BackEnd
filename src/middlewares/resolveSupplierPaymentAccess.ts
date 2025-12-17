import {NextFunction, Request, Response} from 'express';

import {UserRole} from '../entities/User';

/**
 * Middleware to authorize access to a Supplier Payment Receipt.
 * Requires resolveSupplierPaymentReceipt to be called first.
 */
export async function resolveSupplierPaymentAccess(
    req: Request,
    res: Response,
    next: NextFunction,
)
{
    const user = req.user;
    const receipt = req.paymentReceipt;

    if (!user) return res.status(401).end();
    if (!receipt)
        return res.status(404).json(
            {message: 'Recibo não encontrado'});

    const isAdmin = user.role === UserRole.ADMIN;
    const isSupplierOwner =
        receipt.supplier.manager?.uuid === user.uuid;
    const isSupplierEmployee = user.employedSuppliers?.some(
        (s) => s.uuid === receipt.supplier.uuid,
    );
    const isNGOManager =
        req.ngo && req.ngo.manager?.uuid === user.uuid;

    if (!isAdmin && !isSupplierOwner && !isSupplierEmployee &&
        !isNGOManager)
        return res.status(403).json({message: 'Permissão negada'});

    next();
}
