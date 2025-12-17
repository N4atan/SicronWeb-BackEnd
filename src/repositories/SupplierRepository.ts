import {FindManyOptions} from 'typeorm';

import {AppDataSource} from '../config/data-source';
import {Supplier} from '../entities/Supplier';
import {User, UserRole} from '../entities/User';
import logger from '../utils/logger';

/**
 * Repository for Supplier operations.
 */
export class SupplierRepository
{
    public repository = AppDataSource.getRepository(Supplier);

    /**
     * Creates and saves a new Supplier.
     * @param supplier - Supplier entity.
     * @returns Promise<Supplier>
     */
    public async createAndSave(supplier: Supplier): Promise<Supplier>
    {
        const created = this.repository.create(supplier);
        const saved = await this.repository.save(created);
        logger.table(saved);
        return saved;
    }

    /**
     * Saves a Supplier entity.
     * @param supplier - Supplier entity.
     * @returns Promise<Supplier>
     */
    public async save(supplier: Supplier): Promise<Supplier>
    {
        const saved = await this.repository.save(supplier);
        logger.table(saved);
        return saved;
    }

    /**
     * Finds Suppliers matching options.
     * @param opt - Find options.
     * @returns Promise<Supplier[] | null>
     */
    public async findAll(
        opt?: FindManyOptions<Supplier>,
        ): Promise<Supplier[]|null>
    {
        const found = await this.repository.find(opt);
        logger.table(found);
        return found;
    }

    /**
     * Finds Supplier by CNPJ.
     * @param cnpj - Supplier CNPJ.
     * @returns Promise<Supplier | null>
     */
    public async findByCNPJ(cnpj: string): Promise<Supplier|null>
    {
        return await this.repository.findOne({where: {cnpj}});
    }

    /**
     * Finds all suppliers related to a user (as owner/manager or
     * employee).
     * @param uuid - User UUID.
     * @returns Promise<Supplier[] | null>
     */
    public async findByUserUUID(uuid: string):
        Promise<Supplier[]|null>
    {
        const list = await this.repository.createQueryBuilder('supplier')
            .leftJoinAndSelect('supplier.manager', 'manager')
            .leftJoinAndSelect('supplier.employees', 'employee')
            .where('manager.uuid = :uuid', {uuid})
            .orWhere('employee.uuid = :uuid', {uuid})
            .getMany();
        logger.table(list);
        return list;
    }

    /**
     * Finds Supplier by UUID, loading relations.
     * Relations: manager, employees, products, paymentReceipts.
     * @param uuid - Supplier UUID.
     * @returns Promise<Supplier | null>
     */
    public async findByUUID(uuid: string): Promise<Supplier|null>
    {
        const found = await this.repository.findOne({
            where: {uuid},
            relations: [
                'manager',
                'employees',
                'products',
                'paymentReceipts'
            ],
        });
        logger.table(found);
        return found;
    }

    /**
     * Removes a Supplier by UUID.
     *
     * Additional cleanup performed:
     * - If the supplier's manager has the `SUPPLIER_MANAGER` role,
     * reset it to `USER`.
     * - Remove this supplier from all employees' `employedSuppliers`
     * lists.
     * - Remove this supplier UUID from users' `blockedSuppliers`
     * lists.
     *
     * @param uuid - Supplier UUID.
     * @returns Promise<void>
     */
    public async remove(uuid: string): Promise<void>
    {
        const supplier = await this.findByUUID(uuid);
        if (!supplier) return;

        const userRepo = AppDataSource.getRepository(User);

        if (supplier.manager && supplier.manager.uuid) {
            const manager = await userRepo.findOne(
                {where: {uuid: supplier.manager.uuid}});
            if (manager &&
                manager.role === UserRole.SUPPLIER_MANAGER) {
                manager.role = UserRole.USER;
                await userRepo.save(manager);
            }
        }

        if (supplier.employees && supplier.employees.length) {
            for (const empRef of supplier.employees) {
                const employee = await userRepo.findOne({
                    where: {uuid: empRef.uuid},
                    relations: ['employedSuppliers']
                });
                if (!employee) continue;
                if (employee.employedSuppliers &&
                    employee.employedSuppliers.length) {
                    employee.employedSuppliers =
                        employee.employedSuppliers.filter(
                            s => s.uuid !== uuid);
                    if (!employee.employedSuppliers.length)
                        employee.role = UserRole.USER;
                    await userRepo.save(employee);
                }
            }
        }

        const usersWithBlocked =
            await userRepo.createQueryBuilder('user')
                .where('user.blockedSuppliers IS NOT NULL')
                .andWhere(
                    'user.blockedSuppliers LIKE :like',
                    {like: `%${uuid}%`})
                .getMany();

        for (const u of usersWithBlocked) {
            const up =
                await userRepo.findOne({where: {uuid: u.uuid}});
            if (!up || !up.blockedSuppliers) continue;
            const filtered =
                up.blockedSuppliers.filter(s => s !== uuid);
            if (filtered.length !== up.blockedSuppliers.length) {
                up.blockedSuppliers =
                    filtered.length ? filtered : undefined;
                await userRepo.save(up);
            }
        }

        await this.repository.remove(supplier);
    }
}
