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
      .leftJoinAndSelect('supplier.owner', 'owner')
      .leftJoinAndSelect('supplier.employees', 'employee')
      .where('owner.uuid = :uuid', { uuid })
      .orWhere('employee.uuid = :uuid', { uuid })
      .getMany()
  }

  public async findByUUID(uuid: string): Promise<Supplier | null> {
    return await this.repository.findOne({
      where: { uuid },
      relations: ['owner', 'employees', 'products', 'paymentReceipts']
    })
  }

  public async remove(uuid: string): Promise<void> {
    const supplier = await this.findByUUID(uuid)
    if (supplier) await this.repository.remove(supplier)
  }
}

