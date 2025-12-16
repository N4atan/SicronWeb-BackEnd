import { FindManyOptions } from "typeorm";
import { AppDataSource } from '../config/data-source';

import { NGOProduct } from '../entities/NGOProduct';
import { NGO } from '../entities/NGO';
import { Product } from '../entities/Product';

export class NGOProductRepository {
  private repository = AppDataSource.getRepository(NGOProduct)

  public async createAndSave(ngoProduct: NGOProduct): Promise<NGOProduct> {
    const created = this.repository.create(ngoProduct);
    return await this.repository.save(created);
  }


  public async save(product: NGOProduct): Promise<NGOProduct> {
    return await this.repository.save(product);
  }

  public async findAll(opt?: FindManyOptions<NGOProduct>): Promise<NGOProduct[] | null> {
    return await this.repository.find(opt);
  }

  public async find(ngo: NGO, product: Product): Promise<NGOProduct | null> {
    return await this.repository.findOne({
      where: {
        ngo: { uuid: ngo.uuid },
        product: { uuid: product.uuid }
      },
      relations: ['ngo', 'product']
    });
  }

  public async listByNGO(ngo: NGO): Promise<NGOProduct[]> {
    return await this.repository.find({
      where: { ngo: { uuid: ngo.uuid } },
      relations: ['product']
    });
  }

  public async updateQuantity(ngo: NGO, product: Product, quantity: number): Promise<void> {
    const entry = await this.find(ngo, product);
    if (entry) {
      entry.quantity = quantity;
      await this.repository.save(entry);
    }
  }

  public async findById(id: number): Promise<NGOProduct | null> {
    return await this.repository.findOne({ where: { id }, relations: ['ngo', 'product'] });
  }

  public async remove(ngo: NGO, product: Product): Promise<void> {
    const entry = await this.find(ngo, product);
    if (entry) await this.repository.remove(entry);
  }

  public async removeById(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
