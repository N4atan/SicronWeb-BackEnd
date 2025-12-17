import {FindManyOptions} from 'typeorm';

import {AppDataSource} from '../config/data-source';
import {Supplier} from '../entities/Supplier';

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
        return await this.repository.save(created);
    }

    /**
     * Saves a Supplier entity.
     * @param supplier - Supplier entity.
     * @returns Promise<Supplier>
     */
    public async save(supplier: Supplier): Promise<Supplier>
    {
        return await this.repository.save(supplier);
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
        return await this.repository.find(opt);
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
        return await this.repository.createQueryBuilder('supplier')
            .leftJoinAndSelect('supplier.manager', 'manager')
            .leftJoinAndSelect('supplier.employees', 'employee')
            .where('manager.uuid = :uuid', {uuid})
            .orWhere('employee.uuid = :uuid', {uuid})
            .getMany();
    }

    /**
     * Finds Supplier by UUID, loading relations.
     * Relations: manager, employees, products, paymentReceipts.
     * @param uuid - Supplier UUID.
     * @returns Promise<Supplier | null>
     */
    public async findByUUID(uuid: string): Promise<Supplier|null>
    {
        return await this.repository.findOne({
            where: {uuid},
            relations: [
                'manager',
                'employees',
                'products',
                'paymentReceipts'
            ],
        });
    }

    /**
     * Removes a Supplier by UUID.
     * @param uuid - Supplier UUID.
     * @returns Promise<void>
     */
    public async remove(uuid: string): Promise<void>
    {
        const supplier = await this.findByUUID(uuid);
        if (supplier) await this.repository.remove(supplier);
    }
}
