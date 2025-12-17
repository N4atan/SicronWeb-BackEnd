import {Repository} from 'typeorm';

import {NGO} from '../entities/NGO';
import {Supplier} from '../entities/Supplier';
import {User, UserRole} from '../entities/User';

/**
 * Union type representing an Organization (either NGO or Supplier).
 */
export type Organization = NGO|Supplier;

/**
 * Service to handle employment logic for NGOs and Suppliers.
 * Centralizes hire, dismiss, and block operations to avoid
 * duplication.
 */
export class EmploymentService
{
    /**
     * Adds an employee to an organization.
     *
     * @param userRepo - UserRepository instance.
     * @param orgRepo - Repository for the organization (NGO or
     *     Supplier).
     * @param org - The organization entity (must include employees
     *     relation).
     * @param userUUID - The UUID of the user to add.
     * @param role - The role to assign (NGO_EMPLOYER or
     *     SUPPLIER_EMPLOYER).
     * @param blockListProperty - The property name on User that holds
     *     blocked UUIDs.
     * @param employeesProperty - The property name on Organization
     *     that holds the list of employees.
     * @param userEmployedProperty - The property name on User that
     *     holds the list of employed organizations.
     * @returns Promise<{ status: number, message?: string }> - Result
     *     status and message.
     */
    static async hire(
        userRepo: Repository<User>,
        orgRepo: Repository<Organization>,
        org: Organization,
        userUUID: string,
        role: UserRole,
        blockListProperty: 'blockedNGOs'|'blockedSuppliers',
        employeesProperty: 'employees',
        userEmployedProperty: 'employedNGOs'|'employedSuppliers',
        ): Promise<{status: number; message?: string}>
    {
        if (!userUUID)
            return {status: 400, message: 'user_uuid obrigatório'};

        const user = await userRepo.findOneBy({uuid: userUUID});
        if (!user)
            return {status: 404, message: 'Usuário não encontrado'};

        // Check if blocked
        const blockedList = user[blockListProperty];
        if (blockedList?.includes(org.uuid)) {
            return {
                status: 403,
                message: 'Usuário bloqueado para esta organização',
            };
        }

        // Check internal existence
        // Using strict property access
        const employees = org[employeesProperty] || [];

        if (!employees.find((u) => u.uuid === user.uuid)) {
            user.role = role;

            // Update user side
            const userEmployed = user[userEmployedProperty] || [];
            user[userEmployedProperty] = [...userEmployed, org] as
                any;  // eslint-disable-line @typescript-eslint/no-explicit-any

            // Update org side
            org[employeesProperty] = [...employees, user];

            await userRepo.save(user);
            await orgRepo.save(org);
        }

        return {status: 204};
    }

    /**
     * Removes an employee from an organization.
     *
     * @param userRepo - UserRepository instance.
     * @param orgRepo - Repository for the organization.
     * @param org - The organization entity.
     * @param userUUID - The UUID of the user to remove.
     * @param userEmployedProperty - The property name on User for
     *     employed orgs.
     * @param reqUser - The user making the request (for permission
     *     check).
     * @returns Promise<{ status: number, message?: string }> - Result
     *     status and message.
     */
    static async dismiss(
        userRepo: Repository<User>,
        orgRepo: Repository<Organization>,
        org: Organization,
        userUUID: string,
        userEmployedProperty: 'employedNGOs'|'employedSuppliers',
        reqUser: {uuid: string; role: string},
        ): Promise<{status: number; message?: string}>
    {
        if (!userUUID)
            return {status: 400, message: 'user_uuid obrigatório'};

        const user = await userRepo.findOne({
            where: {uuid: userUUID},
            relations: [userEmployedProperty],
        });

        if (!user)
            return {status: 404, message: 'Usuário não encontrado'};

        // Permission check
        const managerUUID = org.manager?.uuid;
        if (user.uuid !== reqUser.uuid &&
            reqUser.role !== UserRole.ADMIN &&
            managerUUID !== reqUser.uuid) {
            return {status: 403, message: 'Permissão negada'};
        }

        // Remove from User side
        const currentJobs = user[userEmployedProperty] || [];
        user[userEmployedProperty] = currentJobs.filter(
                                         (o) => o.uuid !== org.uuid,
                                         ) as
            any;  // eslint-disable-line @typescript-eslint/no-explicit-any

        // Remove from Org side
        const currentEmployees = org.employees || [];
        org.employees = currentEmployees.filter(
            (u: User) => u.uuid !== user.uuid,
        );

        // Reset role if no more jobs in this category
        if (user[userEmployedProperty]?.length === 0) {
            if ([UserRole.NGO_EMPLOYER, UserRole.SUPPLIER_EMPLOYER]
                    .includes(user.role)) {
                user.role = UserRole.USER;
            }
        }

        await userRepo.save(user);
        await orgRepo.save(org);

        return {status: 204};
    }

    /**
     * Blocks or unblocks a user/employee from an organization.
     *
     * @param userRepo - UserRepository instance.
     * @param orgRepo - Repository for the organization.
     * @param org - The organization entity.
     * @param reqUser - The user performing the block (usually the
     *     user themselves blocking the org).
     * @param userEmployedProperty - The property name on User for
     *     employed orgs.
     * @param blockListProperty - The property name on User for
     *     blocked orgs.
     * @returns Promise<{ status: number, message?: string }> - Result
     *     status and message.
     */
    static async block(
        userRepo: Repository<User>,
        orgRepo: Repository<Organization>,
        org: Organization,
        reqUser: User,
        userEmployedProperty: 'employedNGOs'|'employedSuppliers',
        blockListProperty: 'blockedNGOs'|'blockedSuppliers',
        ): Promise<{status: number; message?: string}>
    {
        const user =
            reqUser;  // The user is blocking the org for themselves

        // Remove employment if exists
        const currentJobs = user[userEmployedProperty] || [];
        user[userEmployedProperty] = currentJobs.filter(
                                         (o) => o.uuid !== org.uuid,
                                         ) as
            any;  // eslint-disable-line @typescript-eslint/no-explicit-any

        const currentEmployees = org.employees || [];
        org.employees = currentEmployees.filter(
            (u: User) => u.uuid !== user.uuid,
        );

        if (user[userEmployedProperty]?.length === 0) {
            if ([UserRole.NGO_EMPLOYER, UserRole.SUPPLIER_EMPLOYER]
                    .includes(user.role)) {
                user.role = UserRole.USER;
            }
        }

        // Toggle Block
        const blockedSet = new Set(
            user[blockListProperty] || [],
        );
        if (blockedSet.has(org.uuid)) {
            blockedSet.delete(org.uuid);
        }
        else {
            blockedSet.add(org.uuid);
        }

        user[blockListProperty] = Array.from(blockedSet);

        await orgRepo.save(org);
        await userRepo.save(user);

        return {status: 204};
    }
}
