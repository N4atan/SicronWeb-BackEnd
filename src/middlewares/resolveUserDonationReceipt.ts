import {NextFunction, Request, Response} from 'express';

import {UserDonationReceiptRepository} from '../repositories/UserDonationReceiptRepository';

const repo = new UserDonationReceiptRepository();

/**
 * Middleware to resolve User Donation Receipt.
 * Populates req.donationReceipt.
 */
export async function resolveUserDonationReceipt(
    req: Request,
    res: Response,
    next: NextFunction,
)
{
    const {uuid} = req.params;
    if (!uuid) return res.status(400).json({message: 'UUID ausente'});

    const receipt = await repo.findByUUID(uuid);
    if (!receipt)
        return res.status(404).json(
            {message: 'Recibo de doação não encontrado'});

    req.donationReceipt = receipt;
    next();
}
