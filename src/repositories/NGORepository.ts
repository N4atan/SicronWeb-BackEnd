import {FindManyOptions, Repository} from 'typeorm';

import {AppDataSource} from '../config/data-source';
import {NGO} from '../entities/NGO';

/**
 * Repository for NGO operations.
 */
export class NGORepository
{
    public repository: Repository<NGO> =
        AppDataSource.getRepository('ngotbl');

    /**
     * Creates and saves a new NGO.
     * @param data - Partial NGO data.
     * @returns Promise<NGO> - Created NGO.
     */
    async createAndSave(data: Partial<NGO>): Promise<NGO>
    {
        const ngo = this.repository.create(data);
        return this.save(ngo);
    }

    /**
     * Finds NGOs matching options.
     * @param options - Find options.
     * @returns Promise<NGO[]>
     */
    public async findAll(options?: FindManyOptions<NGO>):
        Promise<NGO[]>
    {
        return this.repository.find(options);
    }

    /**
     * Finds NGO by UUID, loading relations (manager, employees).
     * @param uuid - NGO UUID.
     * @returns Promise<NGO | null>
     */
    public async findByUUID(uuid: string): Promise<NGO|null>
    {
        return this.repository.findOne({
            where: {uuid},
            relations: ['manager', 'employees', 'products'],
        });
    }

    /**
     * Finds NGO by Name.
     * @param name - NGO Name.
     * @returns Promise<NGO | null>
     */
    public async findByName(name: string): Promise<NGO|null>
    {
        return this.repository.findOneBy({name});
    }

    /**
     * Finds NGO by Trade Name.
     * @param trade_name - NGO Trade Name.
     * @returns Promise<NGO | null>
     */
    public async findByTradeName(trade_name: string):
        Promise<NGO|null>
    {
        return this.repository.findOneBy({trade_name});
    }

    /**
     * Saves an NGO entity.
     * @param ngo - NGO entity.
     * @returns Promise<NGO> - Saved NGO.
     */
    public async save(ngo: NGO): Promise<NGO>
    {
        return this.repository.save(ngo);
    }

    /**
     * Removes an NGO entity.
     * @param ngo - NGO entity.
     * @returns Promise<NGO> - Removed NGO.
     */
    public async remove(ngo: NGO): Promise<NGO>
    {
        return this.repository.remove(ngo);
    }
}
