import {FindManyOptions} from 'typeorm';

import {AppDataSource} from '../config/data-source';
import {Product} from '../entities/Product';

/**
 * Repository for Product operations.
 */
export class ProductRepository
{
    private repository = AppDataSource.getRepository(Product);

    /**
     * Creates and saves a new Product.
     * @param product - Product entity.
     * @returns Promise<Product>
     */
    public async createAndSave(product: Product): Promise<Product>
    {
        const created = this.repository.create(product);
        return await this.repository.save(created);
    }

    /**
     * Saves a Product entity.
     * @param product - Product entity.
     * @returns Promise<Product>
     */
    public async save(product: Product): Promise<Product>
    {
        return await this.repository.save(product);
    }

    /**
     * Finds Products matching options.
     * @param opt - Find options.
     * @returns Promise<Product[] | null>
     */
    public async findAll(
        opt?: FindManyOptions<Product>,
        ): Promise<Product[]|null>
    {
        return await this.repository.find(opt);
    }

    /**
     * Finds Product by Name.
     * @param name - Product Name.
     * @returns Promise<Product | null>
     */
    public async findByName(name: string): Promise<Product|null>
    {
        return await this.repository.findOne({where: {name}});
    }

    /**
     * Lists all Products.
     * @returns Promise<Product[]>
     */
    public async listAll(): Promise<Product[]>
    {
        return await this.repository.find();
    }

    /**
     * Removes a Product by Name.
     * @param name - Product Name.
     * @returns Promise<void>
     */
    public async remove(name: string): Promise<void>
    {
        const product = await this.findByName(name);
        if (product) await this.repository.remove(product);
    }
}
