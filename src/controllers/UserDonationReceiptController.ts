import {Request, Response} from 'express';

import {UserRole} from '../entities/User';
import {UserDonationReceipt} from '../entities/UserDonationReceipt';
import {NGORepository} from '../repositories/NGORepository';
import {UserDonationReceiptRepository} from '../repositories/UserDonationReceiptRepository';

/**
 * Controller for managing User Donation Receipts.
 */
export class UserDonationReceiptController
{
    private static receiptRepository =
        new UserDonationReceiptRepository();
    private static ngoRepository = new NGORepository();

    /**
     * Creates a new Donation Receipt.
     *
     * @param req - Express Request object containing donation
     *     details.
     * @param res - Express Response object.
     * @returns Promise<Response> - 201 Created or error.
     */
    static async create(req: Request, res: Response):
        Promise<Response>
    {
        const {ngo_uuid, fileUrl, amount} = req.body;

        if (!ngo_uuid || !fileUrl || amount === undefined)
            return res.status(400).json(
                {message: 'Campos obrigatórios'});

        const ngo = req.ngo!;

        const receipt = new UserDonationReceipt({
            user: req.user!,
            ngo,
            fileUrl,
            amount,
        });

        await this.receiptRepository.createAndSave(receipt);
        return res.status(201)
            .location(`/donations/${receipt.uuid}`)
            .send();
    }

    /**
     * Queries Donation Receipts.
     *
     * @param req - Express Request object containing query filters.
     * @param res - Express Response object.
     * @returns Promise<Response> - List of donations matching
     *     criteria.
     */
    static async query(req: Request, res: Response): Promise<Response>
    {
        const {ngo_uuid, user_uuid} = req.query;
        const filters: Record<string, unknown> = {};

        if (ngo_uuid) filters.ngo = {uuid: String(ngo_uuid)};
        if (user_uuid) filters.user = {uuid: String(user_uuid)};

        if (req.user!.role === UserRole.ADMIN)
            return res.status(200).json({
                donations: await this.receiptRepository.findAll(
                    {where: filters}),
            });

        if (req.user!.role === UserRole.USER)
            filters.user = {uuid: req.user!.uuid};

        if (req.user!.role === UserRole.NGO_MANAGER ||
            req.user!.role === UserRole.NGO_EMPLOYER)
            filters.ngo = {manager: {uuid: req.user!.uuid}};

        const donations =
            await this.receiptRepository.findAll({where: filters});
        return res.status(200).json({donations});
    }
}
