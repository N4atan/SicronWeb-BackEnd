import { FindManyOptions } from 'typeorm'
import { AppDataSource } from '../config/data-source'
import { Supplier } from '../entities/Supplier'

export class SupplierRepository {
  public repository = AppDataSource.getRepository(Supplier)

  public async createAndSave(supplier: Supplier): Promise<Supplier> {
    const created = this.repository.create(supplier)
    return await this.repository.save(created)
  }

  public async save(supplier: Supplier): Promise<Supplier> {
    return await this.repository.save(supplier)
  }

  public async findAll(opt?: FindManyOptions<Supplier>): Promise<Supplier[] | null> {
    return await this.repository.find(opt)
  }

  public async findByCNPJ(cnpj: string): Promise<Supplier | null> {
    return await this.repository.findOne({ where: { cnpj } })
  }

  /**
   * Retorna todos os suppliers relacionados ao usuário, seja como owner ou employee.
   */
  public async findByUserUUID(uuid: string): Promise<Supplier[] | null> {
    return await this.repository
      .createQueryBuilder('supplier')
      .leftJoinAndSelect('supplier.manager', 'manager') // Correção: owner -> manager
      .leftJoinAndSelect('supplier.employees', 'employee')
      .where('manager.uuid = :uuid', { uuid })
      .orWhere('employee.uuid = :uuid', { uuid })
      .getMany()
  }

  public async findByUUID(uuid: string): Promise<Supplier | null> {
    return await this.repository.findOne({
      where: { uuid },
      where: { uuid },
      relations: ['manager'] // CRITICAL FIX: Removed 'employees' to solve 500 tablePath error. Only manager is needed.
    })
  }

  public async findByUUIDWithRelations(uuid: string, relations: string[]): Promise<Supplier | null> {
    return await this.repository.findOne({ where: { uuid }, relations });
  }

  public async remove(uuid: string): Promise<void> {
    const supplier = await this.findByUUID(uuid)
    if (supplier) await this.repository.remove(supplier)
  }
}

