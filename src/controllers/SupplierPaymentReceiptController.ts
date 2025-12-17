import {Request, Response} from 'express';

import {SupplierPaymentReceipt} from '../entities/SupplierPaymentReceipt';
import {UserRole} from '../entities/User';
import {SupplierPaymentReceiptRepository} from '../repositories/SupplierPaymentReceiptRepository';
import {SupplierRepository} from '../repositories/SupplierRepository';

/**
 * Controller for managing Supplier Payment Receipts.
 */
export class SupplierPaymentReceiptController
{
    private static receiptRepository =
        new SupplierPaymentReceiptRepository();
    private static supplierRepository = new SupplierRepository();

    /**
     * Creates a new Payment Receipt for a Supplier.
     *
     * @param req - Express Request object containing payment details.
     * @param res - Express Response object.
     * @returns Promise<Response> - 201 Created or error.
     */
    static async create(req: Request, res: Response):
        Promise<Response>
    {
        if (!req.user) return res.status(401).end();

        const {supplier_uuid, fileUrl, amount} = req.body;

        if (!supplier_uuid || !fileUrl || amount === undefined)
            return res.status(400).json(
                {message: 'Campos obrigatórios'});

        const supplier =
            await this.supplierRepository.findByUUID(supplier_uuid);
        if (!supplier)
            return res.status(404).json(
                {message: 'Fornecedor não encontrado'});

        if (req.user!.role !== UserRole.ADMIN &&
            (!req.ngo || req.user.uuid !== req.ngo.manager.uuid))
            return res.status(403).json(
                {message: 'Permissão negada'});

        const receipt = new SupplierPaymentReceipt({
            supplier,
            fileUrl,
            amount,
        });

        await this.receiptRepository.createAndSave(receipt);
        return res.status(201)
            .location(`/payments/${receipt.uuid}`)
            .send();
    }

    /**
     * Queries Payment Receipts.
     *
     * @param req - Express Request object containing query filters.
     * @param res - Express Response object.
     * @returns Promise<Response> - List of receipts matching
     *     criteria.
     */
    static async query(req: Request, res: Response): Promise<Response>
    {
        if (!req.user) return res.status(401).end();

        const {supplier_uuid} = req.query;
        const filters: Record<string, unknown> = {};

        if (supplier_uuid)
            filters.supplier = {uuid: String(supplier_uuid)};

        if (req.user!.role === UserRole.ADMIN)
            return res.status(200).json({
                payments: await this.receiptRepository.findAll(
                    {where: filters}),
            });

        if (req.user!.role === UserRole.NGO_MANAGER ||
            req.user!.role === UserRole.NGO_EMPLOYER) {
            if (!req.ngo)
                return res.status(400).json(
                    {message: 'Nenhuma ONG associada à sessão'});
            filters.ngo = {uuid: req.ngo.uuid};
            const payments = await this.receiptRepository.findAll(
                {where: filters});
            return res.status(200).json({payments});
        }

        if (req.user!.role === UserRole.SUPPLIER_MANAGER ||
            req.user!.role === UserRole.SUPPLIER_EMPLOYER) {
            const payments: SupplierPaymentReceipt[] = [];
            const suppliers = req.supplier ?
                [req.supplier] :
                await this.supplierRepository.findByUserUUID(
                    req.user!.uuid);
            if (!suppliers)
                return res.status(404).json(
                    {message: 'Fornecedor não encontrado'});

            for (let i = 0; i < suppliers.length; ++i) {
                filters.supplier = {uuid: suppliers[i].uuid};
                const result = await this.receiptRepository.findAll(
                    {where: filters});
                if (result) payments.push(...result);
            }

            return res.status(200).json({payments});
        }

        return res.status(403).json({message: 'Permissão negada'});
    }

    /**
     * Deletes a Payment Receipt.
     *
     * @param req - Express Request object.
     * @param res - Express Response object.
     * @returns Promise<Response> - 204 No Content.
     */
    static async delete(req: Request, res: Response):
        Promise<Response>
    {
        await this.receiptRepository.remove(req.paymentReceipt!);
        return res.status(204).end();
    }
}
