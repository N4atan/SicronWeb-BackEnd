import { FindManyOptions } from "typeorm"; 

import { AppDataSource } from '../config/data-source';

import { SupplierProduct } from '../entities/SupplierProduct';
import { Supplier        } from '../entities/Supplier';
import { Product         } from '../entities/Product';

export class SupplierProductRepository {
  public repository = AppDataSource.getRepository(SupplierProduct);

  public async createAndSave(supplierProduct: SupplierProduct): Promise<SupplierProduct>
  {
    const created = this.repository.create(supplierProduct);
    return await this.repository.save(created);
  }

  public async save(supplier: SupplierProduct): Promise<SupplierProduct>
  {
    return await this.repository.save(supplier);	
  }

  public async findAll(opt?: FindManyOptions<SupplierProduct>): Promise<SupplierProduct[] | null>
  {
    return await this.repository.find(opt);
  }

  public async find(supplier: Supplier, product: Product): Promise<SupplierProduct | null>
  {
    return await this.repository.findOne({
      where: { supplier, product },
      relations: ['supplier', 'product']
    });
  }

  public async listBySupplier(supplier: Supplier): Promise<SupplierProduct[]>
  {
    return await this.repository.find({
      where: { supplier },
      relations: ['product']
    });
  }

  public async updateData(supplier: Supplier, product: Product, price: number, availableQuantity: number): Promise<void>
  {
    const entry = await this.find(supplier, product);
    if (entry) {
      entry.price = price;
      entry.availableQuantity = availableQuantity;
      await this.repository.save(entry);
    }
  }

  public async remove(supplier: Supplier, product: Product): Promise<void>
  {
    const entry = await this.find(supplier, product);
    if (entry) await this.repository.remove(entry);
  }
}
