import { FindManyOptions } from "typeorm";

import { AppDataSource } from '../config/data-source';

import { Supplier } from '../entities/Supplier';

export class SupplierRepository {
  public repository = AppDataSource.getRepository(Supplier);

  public async createAndSave(supplier: Supplier): Promise<Supplier>
  {
    const created = this.repository.create(supplier);
    return await this.repository.save(created);
  }

  public async save(supplier: Supplier): Promise<Supplier>
  {
    return await this.repository.save(supplier);	
  }

  public async findAll(opt?: FindManyOptions<Supplier>): Promise<Supplier[] | null>
  {
    return await this.repository.find(opt);
  }

  public async findByCNPJ(cnpj: string): Promise<Supplier | null>
  {
    return await this.repository.findOne({ where: { cnpj } });
  }

  public async findByUUID(uuid: string): Promise<Supplier | null>
  {
    return await this.repository.findOne({ where: { uuid } });
  }

  public async delete(uuid: string): Promise<void>
  {
    const supplier = await this.findByUUID(uuid);
    if (supplier) await this.repository.remove(supplier);
  }
}
