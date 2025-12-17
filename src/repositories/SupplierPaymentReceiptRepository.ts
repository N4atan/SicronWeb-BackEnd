import {FindManyOptions} from 'typeorm';

import {AppDataSource} from '../config/data-source';
import {Supplier} from '../entities/Supplier';
import {SupplierPaymentReceipt} from '../entities/SupplierPaymentReceipt';
import logger from '../utils/logger';

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
        const saved = await this.repository.save(created);
        logger.table(saved);
        return saved;
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
        const saved = await this.repository.save(receipt);
        logger.table(saved);
        return saved;
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
        const found = await this.repository.find(opt);
        logger.table(found);
        return found;
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
        const found = await this.repository.findOne({
            where: {uuid},
            relations: ['supplier', 'supplier.manager'],
        });
        logger.table(found);
        return found;
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
        const list = await this.repository.find({
            where: {supplier},
            order: {paymentDate: 'DESC'},
        });
        logger.table(list);
        return list;
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
