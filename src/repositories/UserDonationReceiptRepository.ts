import {FindManyOptions} from 'typeorm';

import {AppDataSource} from '../config/data-source';
import {NGO} from '../entities/NGO';
import {User} from '../entities/User';
import {UserDonationReceipt} from '../entities/UserDonationReceipt';

/**
 * Repository for User Donation Receipts.
 */
export class UserDonationReceiptRepository
{
    private repository =
        AppDataSource.getRepository(UserDonationReceipt);

    /**
     * Creates and saves a receipt.
     * @param receipt - Receipt entity.
     * @returns Promise<UserDonationReceipt>
     */
    public async createAndSave(
        receipt: UserDonationReceipt,
        ): Promise<UserDonationReceipt>
    {
        const created = this.repository.create(receipt);
        return await this.repository.save(created);
    }

    /**
     * Saves a receipt.
     * @param receipt - Receipt entity.
     * @returns Promise<UserDonationReceipt>
     */
    public async save(
        receipt: UserDonationReceipt,
        ): Promise<UserDonationReceipt>
    {
        return await this.repository.save(receipt);
    }

    /**
     * Finds receipts matching options.
     * @param opt - Find options.
     * @returns Promise<UserDonationReceipt[] | null>
     */
    public async findAll(
        opt?: FindManyOptions<UserDonationReceipt>,
        ): Promise<UserDonationReceipt[]|null>
    {
        return await this.repository.find(opt);
    }

    /**
     * Finds receipt by UUID.
     * @param uuid - Receipt UUID.
     * @returns Promise<UserDonationReceipt | null>
     */
    public async findByUUID(uuid: string):
        Promise<UserDonationReceipt|null>
    {
        return await this.repository.findOne({
            where: {uuid},
            relations: ['user', 'ngo', 'ngo.manager'],
        });
    }

    /**
     * Lists receipts by User.
     * @param user - The User.
     * @returns Promise<UserDonationReceipt[]>
     */
    public async listByUser(user: User):
        Promise<UserDonationReceipt[]>
    {
        return await this.repository.find({
            where: {user},
            relations: ['ngo'],
            order: {donationDate: 'DESC'},
        });
    }

    /**
     * Lists receipts by NGO.
     * @param ngo - The NGO.
     * @returns Promise<UserDonationReceipt[]>
     */
    public async listByNGO(ngo: NGO): Promise<UserDonationReceipt[]>
    {
        return await this.repository.find({
            where: {ngo},
            relations: ['user'],
            order: {donationDate: 'DESC'},
        });
    }

    /**
     * Removes a receipt.
     * @param receipt - Receipt entity to remove.
     * @returns Promise<void>
     */
    public async remove(receipt: UserDonationReceipt): Promise<void>
    {
        await this.repository.remove(receipt);
    }
}
