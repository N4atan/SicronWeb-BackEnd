import { AppDataSource } from '../config/data-source';

import { Product } from '../entities/Product';

export class ProductRepository {
  private repository = AppDataSource.getRepository(Product);

  public async createAndSave(product: Product): Promise<Product>
  {
    const created = this.repository.create(product);
    return await this.repository.save(created);
  }

  public async findByName(name: string): Promise<Product | null>
  {
    return await this.repository.findOne({ where: { name } });
  }

  public async listAll(): Promise<Product[]>
  {
    return await this.repository.find();
  }

  public async delete(name: string): Promise<void>
  {
    const product = await this.findByName(name);
    if (product) await this.repository.remove(product);
  }
}