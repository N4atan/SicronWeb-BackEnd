import {FindManyOptions} from 'typeorm';

import {AppDataSource} from '../config/data-source';
import {NGO} from '../entities/NGO';
import {User} from '../entities/User';
import {UserDonationReceipt} from '../entities/UserDonationReceipt';
import logger from '../utils/logger';

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
        const saved = await this.repository.save(created);
        logger.table(saved);
        return saved;
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
        const saved = await this.repository.save(receipt);
        logger.table(saved);
        return saved;
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
        const found = await this.repository.find(opt);
        logger.table(found);
        return found;
    }

    /**
     * Finds receipt by UUID.
     * @param uuid - Receipt UUID.
     * @returns Promise<UserDonationReceipt | null>
     */
    public async findByUUID(uuid: string):
        Promise<UserDonationReceipt|null>
    {
        const found = await this.repository.findOne({
            where: {uuid},
            relations: ['user', 'ngo', 'ngo.manager'],
        });
        logger.table(found);
        return found;
    }

    /**
     * Lists receipts by User.
     * @param user - The User.
     * @returns Promise<UserDonationReceipt[]>
     */
    public async listByUser(user: User):
        Promise<UserDonationReceipt[]>
    {
        const list = await this.repository.find({
            where: {user},
            relations: ['ngo'],
            order: {donationDate: 'DESC'},
        });
        logger.table(list);
        return list;
    }

    /**
     * Lists receipts by NGO.
     * @param ngo - The NGO.
     * @returns Promise<UserDonationReceipt[]>
     */
    public async listByNGO(ngo: NGO): Promise<UserDonationReceipt[]>
    {
        const list = await this.repository.find({
            where: {ngo},
            relations: ['user'],
            order: {donationDate: 'DESC'},
        });
        logger.table(list);
        return list;
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
