import {FindManyOptions, Repository} from 'typeorm';

import {AppDataSource} from '../config/data-source';
import {NGO} from '../entities/NGO';
import {User, UserRole} from '../entities/User';

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
     * Removes an NGO entity and performs cleanup:
     * - If NGO manager has `NGO_MANAGER` role, reset to `USER`.
     * - Remove this NGO from employees' `employedNGOs` lists and reset their role
     *   to `USER` if they are no longer employed anywhere.
     * - Remove this NGO UUID from users' `blockedNGOs` lists.
     *
     * Returns the removed NGO entity.
     */
    public async remove(ngo: NGO): Promise<NGO>
    {
        const userRepo = AppDataSource.getRepository(User);

        if (ngo.manager && ngo.manager.uuid) {
            const manager = await userRepo.findOne({where: {uuid: ngo.manager.uuid}});
            if (manager && manager.role === UserRole.NGO_MANAGER) {
                manager.role = UserRole.USER;
                await userRepo.save(manager);
            }
        }

        if (ngo.employees && ngo.employees.length) {
            for (const empRef of ngo.employees) {
                const employee = await userRepo.findOne({where: {uuid: empRef.uuid}, relations: ['employedNGOs']});
                if (!employee) continue;
                if (employee.employedNGOs && employee.employedNGOs.length) {
                    employee.employedNGOs = employee.employedNGOs.filter(n => n.uuid !== ngo.uuid);
                    if (!employee.employedNGOs.length) employee.role = UserRole.USER;
                    await userRepo.save(employee);
                }
            }
        }

        const usersWithBlocked = await userRepo.createQueryBuilder('user')
            .where('user.blockedNGOs IS NOT NULL')
            .andWhere('user.blockedNGOs LIKE :like', {like: `%${ngo.uuid}%`})
            .getMany();

        for (const u of usersWithBlocked) {
            const up = await userRepo.findOne({where: {uuid: u.uuid}});
            if (!up || !up.blockedNGOs) continue;
            const filtered = up.blockedNGOs.filter(s => s !== ngo.uuid);
            if (filtered.length !== up.blockedNGOs.length) {
                up.blockedNGOs = filtered.length ? filtered : undefined;
                await userRepo.save(up);
            }
        }

        return this.repository.remove(ngo);
    }
}
