import { AppDataSource } from '../config/data-source';

import { NGOProduct } from '../entities/NGOProduct';
import { NGO        } from '../entities/NGO';
import { Product    } from '../entities/Product';

export class NGOProductRepository {
  private repository = AppDataSource.getRepository(NGOProduct)

  public async createAndSave(ngoProduct: NGOProduct): Promise<NGOProduct>
  {
    const created = this.repository.create(ngoProduct);
    return await this.repository.save(created);
  }

  public async findByNGOAndProduct(ngo: NGO, product: Product): Promise<NGOProduct | null>
  {
    return await this.repository.findOne({
      where: { ngo, product },
      relations: ['ngo', 'product']
    });
  }

  public async listByNGO(ngo: NGO): Promise<NGOProduct[]>
  {
    return await this.repository.find({
      where: { ngo },
      relations: ['product']
    });
  }

  public async updateQuantity(ngo: NGO, product: Product, quantity: number): Promise<void>
  {
    const entry = await this.findByNGOAndProduct(ngo, product);
    if (entry) {
      entry.requiredQuantity = quantity;
      await this.repository.save(entry);
    }
  }

  public async deleteByNGOAndProduct(ngo: NGO, product: Product): Promise<void>
  {
    const entry = await this.findByNGOAndProduct(ngo, product);
    if (entry) await this.repository.remove(entry);
  }
}