import { FindManyOptions } from "typeorm";

import { AppDataSource } from '../config/data-source';

import { UserDonationReceipt } from '../entities/UserDonationReceipt';
import { User                } from '../entities/User';
import { NGO                 } from '../entities/NGO';

export class UserDonationReceiptRepository {
  private repository = AppDataSource.getRepository(UserDonationReceipt);

  public async createAndSave(receipt: UserDonationReceipt): Promise<UserDonationReceipt>
  {
    const created = this.repository.create(receipt);
    return await this.repository.save(created);
  }

  public async save(receipt: UserDonationReceipt): Promise<UserDonationReceipt>
  {
    return await this.repository.save(receipt);
  }
  
  public async findAll(opt?: FindManyOptions<UserDonationReceipt>): Promise<UserDonationReceipt[] | null>
  {
    return await this.repository.find(opt);
  }

  public async findByUUID(uuid: string): Promise<UserDonationReceipt | null>
  {
    return await this.repository.findOne({
      where: { uuid },
      relations: ['user', 'ngo']
    });
  }

  public async listByUser(user: User): Promise<UserDonationReceipt[]>
  {
    return await this.repository.find({
      where: { user },
      relations: ['ngo'],
      order: { donationDate: 'DESC' }
    });
  }

  public async listByNGO(ngo: NGO): Promise<UserDonationReceipt[]>
  {
    return await this.repository.find({
      where: { ngo },
      relations: ['user'],
      order: { donationDate: 'DESC' }
    });
  }

  public async remove(uuid: string): Promise<void>
  {
    const receipt = await this.findByUUID(uuid);
    if (receipt) await this.repository.remove(receipt);
  }
}
