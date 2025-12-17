import {FindManyOptions} from 'typeorm';

import {AppDataSource} from '../config/data-source';
import {Supplier} from '../entities/Supplier';
import {SupplierPaymentReceipt} from '../entities/SupplierPaymentReceipt';

/**
 * Repository for Supplier Payment Receipts.
 */
export class SupplierPaymentReceiptRepository
{
    private repository =
        AppDataSource.getRepository(SupplierPaymentReceipt);

    /**
     * Creates and saves a receipt.
     * @param receipt - Receipt to save.
     * @returns Promise<SupplierPaymentReceipt>
     */
    public async createAndSave(
        receipt: SupplierPaymentReceipt,
        ): Promise<SupplierPaymentReceipt>
    {
        const created = this.repository.create(receipt);
        return await this.repository.save(created);
    }

    /**
     * Saves a receipt.
     * @param receipt - Receipt to save.
     * @returns Promise<SupplierPaymentReceipt>
     */
    public async save(
        receipt: SupplierPaymentReceipt,
        ): Promise<SupplierPaymentReceipt>
    {
        return await this.repository.save(receipt);
    }

    /**
     * Finds receipts matching options.
     * @param opt - Find options.
     * @returns Promise<SupplierPaymentReceipt[] | null>
     */
    public async findAll(
        opt?: FindManyOptions<SupplierPaymentReceipt>,
        ): Promise<SupplierPaymentReceipt[]|null>
    {
        return await this.repository.find(opt);
    }

    /**
     * Finds receipt by UUID.
     * @param uuid - Receipt UUID.
     * @returns Promise<SupplierPaymentReceipt | null>
     */
    public async findByUUID(
        uuid: string,
        ): Promise<SupplierPaymentReceipt|null>
    {
        return await this.repository.findOne({
            where: {uuid},
            relations: ['supplier', 'supplier.manager'],
        });
    }

    /**
     * Lists receipts by Supplier.
     * @param supplier - The Supplier.
     * @returns Promise<SupplierPaymentReceipt[]>
     */
    public async listBySupplier(
        supplier: Supplier,
        ): Promise<SupplierPaymentReceipt[]>
    {
        return await this.repository.find({
            where: {supplier},
            order: {paymentDate: 'DESC'},
        });
    }

    /**
     * Removes a receipt.
     * @param receipt - Receipt entity to remove.
     * @returns Promise<void>
     */
    public async remove(receipt: SupplierPaymentReceipt):
        Promise<void>
    {
        await this.repository.remove(receipt);
    }
}
