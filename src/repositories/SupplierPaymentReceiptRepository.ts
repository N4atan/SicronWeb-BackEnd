import { AppDataSource } from '../config/data-source'

import { SupplierPaymentReceipt } from '../entities/SupplierPaymentReceipt';
import { Supplier               } from '../entities/Supplier';

export class SupplierPaymentReceiptRepository {
  private repository = AppDataSource.getRepository(SupplierPaymentReceipt);

  public async createAndSave(receipt: SupplierPaymentReceipt): Promise<SupplierPaymentReceipt>
  {
    const created = this.repository.create(receipt);
    return await this.repository.save(created);
  }

  public async findByUUID(uuid: string): Promise<SupplierPaymentReceipt | null>
  {
    return await this.repository.findOne({
      where: { uuid },
      relations: ['supplier']
    });
  }

  public async listBySupplier(supplier: Supplier): Promise<SupplierPaymentReceipt[]>
  {
    return await this.repository.find({
      where: { supplier },
      order: { paymentDate: 'DESC' }
    });
  }

  public async deleteByUUID(uuid: string): Promise<void>
  {
    const receipt = await this.findByUUID(uuid);
    if (receipt) await this.repository.remove(receipt);
  }
}