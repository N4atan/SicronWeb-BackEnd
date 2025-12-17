import {FindManyOptions} from 'typeorm';

import {AppDataSource} from '../config/data-source';
import {NGO} from '../entities/NGO';
import {NGOProduct} from '../entities/NGOProduct';
import {Product} from '../entities/Product';
import logger from '../utils/logger';

/**
 * Repository for NGO Product (Needs) operations.
 */
export class NGOProductRepository
{
    private repository = AppDataSource.getRepository(NGOProduct);

    /**
     * Creates and saves an NGOProduct.
     * @param ngoProduct - The entity to save.
     * @returns Promise<NGOProduct>
     */
    public async createAndSave(ngoProduct: NGOProduct):
        Promise<NGOProduct>
    {
        const created = this.repository.create(ngoProduct);
        const saved = await this.repository.save(created);
        logger.table(saved);
        return saved;
    }

    /**
     * Saves an NGOProduct.
     * @param product - The entity to save.
     * @returns Promise<NGOProduct>
     */
    public async save(product: NGOProduct): Promise<NGOProduct>
    {
        const saved = await this.repository.save(product);
        logger.table(saved);
        return saved;
    }

    /**
     * Finds NGOProducts matching options.
     * @param opt - Find options.
     * @returns Promise<NGOProduct[] | null>
     */
    public async findAll(
        opt?: FindManyOptions<NGOProduct>,
        ): Promise<NGOProduct[]|null>
    {
        const found = await this.repository.find(opt);
        logger.table(found);
        return found;
    }

    /**
     * Finds a specific NGOProduct by NGO and Product.
     * @param ngo - The NGO entity.
     * @param product - The Product entity.
     * @returns Promise<NGOProduct | null>
     */
    public async find(ngo: NGO, product: Product):
        Promise<NGOProduct|null>
    {
        const found = await this.repository.findOne({
            where: {ngo, product},
            relations: ['ngo', 'product'],
        });
        logger.table(found);
        return found;
    }

    /**
     * Lists all products needed by an NGO.
     * @param ngo - The NGO entity.
     * @returns Promise<NGOProduct[]>
     */
    public async listByNGO(ngo: NGO): Promise<NGOProduct[]>
    {
        const list = await this.repository.find({
            where: {ngo},
            relations: ['product'],
        });
        logger.table(list);
        return list;
    }

    /**
     * Updates the quantity of a product need.
     * @param ngo - The NGO entity.
     * @param product - The Product entity.
     * @param quantity - New quantity.
     * @returns Promise<void>
     */
    public async updateQuantity(
        ngo: NGO,
        product: Product,
        quantity: number,
        ): Promise<void>
    {
        const entry = await this.find(ngo, product);
        if (entry) {
            entry.quantity = quantity;
            await this.repository.save(entry);
        }
    }

    /**
     * Removes a product need from an NGO.
     * @param ngo - The NGO entity.
     * @param product - The Product entity.
     * @returns Promise<void>
     */
    public async remove(ngo: NGO, product: Product): Promise<void>
    {
        const entry = await this.find(ngo, product);
        if (entry) await this.repository.remove(entry);
    }
}
