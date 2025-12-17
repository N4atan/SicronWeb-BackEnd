import {FindManyOptions, Repository} from 'typeorm';

import {AppDataSource} from '../config/data-source';
import {User} from '../entities/User';
import {NGO} from '../entities/NGO';
import {Supplier} from '../entities/Supplier';
import {NGORepository} from './NGORepository';
import {SupplierRepository} from './SupplierRepository';

/**
 * Repository for User entity operations.
 */
export class UserRepository
{
    public repository: Repository<User> =
        AppDataSource.getRepository(User);

    /**
     * Creates and saves a new User.
     * @param data - Partial User data.
     * @returns Promise<User> - The created user.
     */
    public async createAndSave(data: Partial<User>): Promise<User>
    {
        const user = this.repository.create(data);
        return this.repository.save(user);
    }

    /**
     * Finds users matching criteria.
     * @param options - Find options.
     * @returns Promise<User[]> - List of users.
     */
    public async findAll(options?: FindManyOptions<User>):
        Promise<User[]>
    {
        return this.repository.find(options);
    }

    /**
     * Finds a user by ID.
     * @param id - User ID.
     * @returns Promise<User | null>
     */
    public async findById(id: number): Promise<User|null>
    {
        return this.repository.findOneBy({id});
    }

    /**
     * Finds a user by UUID.
     * @param uuid - User UUID.
     * @returns Promise<User | null>
     */
    /**
     * Finds a user by UUID, loading essential relations for
     * permissions. Relations: managedNGO, managedSupplier,
     * employedNGOs, employedSuppliers.
     * @param uuid - User UUID.
     * @returns Promise<User | null>
     */
    public async findByUUID(uuid: string): Promise<User|null>
    {
        return this.repository.findOne({
            where: {uuid},
            relations: [
                'managedNGO',
                'managedSupplier',
                'employedNGOs',
                'employedSuppliers',
            ],
        });
    }

    /**
     * Finds a user by Email.
     * @param email - User Email.
     * @returns Promise<User | null>
     */
    public async findByEmail(email: string): Promise<User|null>
    {
        return this.repository.findOneBy({email});
    }

    /**
     * Saves a user entity.
     * @param user - User entity to save.
     * @returns Promise<User> - The saved user.
     */
    public async save(user: User): Promise<User>
    {
        return this.repository.save(user);
    }

    /**
     * Removes a user entity.
     * @param user - User entity to remove.
     * @returns Promise<User> - The removed user.
     */
    public async remove(user: User): Promise<User>
    {
        const ngoRepo = new NGORepository();
        const supplierRepo = new SupplierRepository();

        const managedNGOs = await AppDataSource.getRepository(NGO)
            .createQueryBuilder('ngo')
            .leftJoinAndSelect('ngo.manager', 'manager')
            .where('manager.uuid = :uuid', {uuid: user.uuid})
            .getMany();

        for (const ngo of managedNGOs) {
            await ngoRepo.remove(ngo as any);
        }

        const managedSuppliers = await AppDataSource.getRepository(Supplier)
            .createQueryBuilder('supplier')
            .leftJoinAndSelect('supplier.manager', 'manager')
            .where('manager.uuid = :uuid', {uuid: user.uuid})
            .getMany();

        for (const s of managedSuppliers) {
            await supplierRepo.remove(s as any);
        }

        const ngosWhereEmployee = await AppDataSource.getRepository(NGO)
            .createQueryBuilder('ngo')
            .leftJoinAndSelect('ngo.employees', 'employee')
            .where('employee.uuid = :uuid', {uuid: user.uuid})
            .getMany();

        for (const ngo of ngosWhereEmployee) {
            ngo.employees = ngo.employees.filter(e => e.uuid !== user.uuid);
            await AppDataSource.getRepository(NGO).save(ngo);
        }

        const suppliersWhereEmployee = await AppDataSource.getRepository(Supplier)
            .createQueryBuilder('supplier')
            .leftJoinAndSelect('supplier.employees', 'employee')
            .where('employee.uuid = :uuid', {uuid: user.uuid})
            .getMany();

        for (const supplier of suppliersWhereEmployee) {
            supplier.employees = supplier.employees.filter(e => e.uuid !== user.uuid);
            await AppDataSource.getRepository(Supplier).save(supplier);
        }

        return this.repository.remove(user);
    }
}
