import {FindManyOptions} from 'typeorm';

import {AppDataSource} from '../config/data-source';
import {Product} from '../entities/Product';
import {Supplier} from '../entities/Supplier';
import {SupplierProduct} from '../entities/SupplierProduct';
import logger from '../utils/logger';

/**
 * Repository for Supplier Product (Offers) operations.
 */
export class SupplierProductRepository
{
    public repository = AppDataSource.getRepository(SupplierProduct);

    /**
     * Creates and saves a SupplierProduct.
     * @param supplierProduct - Entity to save.
     * @returns Promise<SupplierProduct>
     */
    public async createAndSave(
        supplierProduct: SupplierProduct,
        ): Promise<SupplierProduct>
    {
        const created = this.repository.create(supplierProduct);
        const saved = await this.repository.save(created);
        logger.table(saved);
        return saved;
    }

    /**
     * Saves a SupplierProduct.
     * @param supplier - Entity to save.
     * @returns Promise<SupplierProduct>
     */
    public async save(supplier: SupplierProduct):
        Promise<SupplierProduct>
    {
        const saved = await this.repository.save(supplier);
        logger.table(saved);
        return saved;
    }

    /**
     * Finds SupplierProducts matching options.
     * @param opt - Find options.
     * @returns Promise<SupplierProduct[] | null>
     */
    public async findAll(
        opt?: FindManyOptions<SupplierProduct>,
        ): Promise<SupplierProduct[]|null>
    {
        const found = await this.repository.find(opt);
        logger.table(found);
        return found;
    }

    /**
     * Finds a specific SupplierProduct tuple.
     * @param supplier - The Supplier.
     * @param product - The Product.
     * @returns Promise<SupplierProduct | null>
     */
    public async find(
        supplier: Supplier,
        product: Product,
        ): Promise<SupplierProduct|null>
    {
        const found = await this.repository.findOne({
            where: {supplier, product},
            relations: ['supplier', 'product'],
        });
        logger.table(found);
        return found;
    }

    /**
     * Lists all products offered by a Supplier.
     * @param supplier - The Supplier.
     * @returns Promise<SupplierProduct[]>
     */
    public async listBySupplier(supplier: Supplier):
        Promise<SupplierProduct[]>
    {
        const list = await this.repository.find({
            where: {supplier},
            relations: ['product'],
        });
        logger.table(list);
        return list;
    }

    /**
     * Updates price and quantity/availability data.
     * @param supplier - The Supplier.
     * @param product - The Product.
     * @param price - New price.
     * @param availableQuantity - New quantity.
     * @returns Promise<void>
     */
    public async updateData(
        supplier: Supplier,
        product: Product,
        price: number,
        availableQuantity: number,
        ): Promise<void>
    {
        const entry = await this.find(supplier, product);
        if (entry) {
            entry.price = price;
            entry.availableQuantity = availableQuantity;
            await this.repository.save(entry);
        }
    }

    /**
     * Removes a product offer from a Supplier.
     * @param supplier - The Supplier.
     * @param product - The Product.
     * @returns Promise<void>
     */
    public async remove(supplier: Supplier, product: Product):
        Promise<void>
    {
        const entry = await this.find(supplier, product);
        if (entry) await this.repository.remove(entry);
    }
}
