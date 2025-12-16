import { FindManyOptions } from "typeorm";

import { AppDataSource } from '../config/data-source';

import { Product } from '../entities/Product';

export class ProductRepository {
  private repository = AppDataSource.getRepository(Product);

  public async createAndSave(product: Product): Promise<Product> {
    const created = this.repository.create(product);
    return await this.repository.save(created);
  }

  public async save(product: Product): Promise<Product> {
    return await this.repository.save(product);
  }

  public async findAll(opt?: FindManyOptions<Product>): Promise<Product[] | null> {
    return await this.repository.find(opt);
  }

  public async findByName(name: string): Promise<Product | null> {
    return await this.repository.findOne({ where: { name } });
  }

  public async findByUUID(uuid: string): Promise<Product | null> {
    return await this.repository.findOne({ where: { uuid } });
  }

  public async listAll(): Promise<Product[]> {
    return await this.repository.find();
  }

  public async remove(uuid: string): Promise<void> {
    const product = await this.findByUUID(uuid);
    if (product) await this.repository.remove(product);
  }
}
