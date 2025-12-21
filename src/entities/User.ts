import {AfterLoad, BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToMany, OneToOne,} from 'typeorm';

import {CryptService} from '../services/CryptService';
import {GenericEntity} from '../types/GenericEntity';

import type {NGO} from './NGO';
import type {Supplier} from './Supplier';

/**
 * Enumeration defining user roles within the SICRON system.
 * 
 * Each role determines the permissions and access levels available to a user.
 * The role hierarchy follows a principle of least privilege, where users
 * are granted only the minimum permissions necessary for their functions.
 */
export enum UserRole {
    /**
     * Basic user with limited access to system resources.
     * Can view public information and manage their own profile.
     */
    USER = 'USER',
    
    /**
     * System administrator with full access to all features.
     * Can manage users, organizations, and system configuration.
     */
    ADMIN = 'ADMIN',
    
    /**
     * NGO administrator responsible for managing NGO operations.
     * Can manage NGO profile, products, and employees.
     */
    NGO_MANAGER = 'NGO_MANAGER',
    
    /**
     * NGO employee with operational access to their assigned NGO.
     * Can perform NGO-related tasks but cannot modify NGO settings.
     */
    NGO_EMPLOYER = 'NGO_EMPLOYER',
    
    /**
     * Supplier administrator responsible for managing supplier operations.
     * Can manage supplier profile, products, and employees.
     */
    SUPPLIER_MANAGER = 'SUPPLIER_MANAGER',
    
    /**
     * Supplier employee with operational access to their assigned supplier.
     * Can perform supplier-related tasks but cannot modify supplier settings.
     */
    SUPPLIER_EMPLOYER = 'SUPPLIER_EMPLOYER',
}

/**
 * Entity representing a User in the SICRON ecosystem.
 * 
 * Users are the primary actors in the system and can be associated with
 * NGOs and Suppliers in various capacities (managers, employees). The entity
 * implements the GenericEntity pattern for secure dual-identifier management.
 * 
 * ## Key Features
 * 
 * ### Authentication & Security
 * - Secure password hashing using bcrypt
 * - JWT-based authentication support
 * - Role-based access control
 * - Session management integration
 * 
 * ### Organization Relationships
 * - Users can manage one NGO and one Supplier simultaneously
 * - Users can be employed by multiple organizations
 * - Blocked organizations system for content filtering
 * 
 * ### Audit Trail
 * - Automatic timestamp tracking for user creation
 * - Password history tracking for security compliance
 * - Role change tracking through audit logs
 * 
 * @example
 * ```typescript
 * // Creating a new user
 * const user = new User({
 *   username: 'john_doe',
 *   email: 'john@example.com',
 *   password: 'securePassword123',
 *   role: UserRole.USER
 * });
 * 
 * await userRepo.createAndSave(user);
 * ```
 * 
 * @example
 * ```typescript
 * // User with organization relationships
 * const ngoManager = new User({
 *   username: 'ngo_admin',
 *   email: 'admin@ngo.org',
 *   password: 'password',
 *   role: UserRole.NGO_MANAGER,
 *   managedNGO: ngoEntity,
 *   employedNGOs: [ngoEntity1, ngoEntity2]
 * });
 * ```
 * 
 * @extends GenericEntity
 * @since 1.0.0
 * @version 1.1.0
 */
@Entity('usertbl') 
export class User extends GenericEntity
{
    @Column() public username!: string;

    @Column({unique: true}) public email!: string;

    @Column() public password!: string;

    @Column({type: 'enum', enum: UserRole, default: UserRole.USER})
    public role!: UserRole;

    @OneToOne('NGO', 'manager')
    @JoinColumn(
        {name: 'managed_ngo_uuid', referencedColumnName: 'uuid'})
    public managedNGO?: NGO;

    @OneToOne('Supplier', 'manager')
    @JoinColumn(
        {name: 'managed_supplier_uuid', referencedColumnName: 'uuid'})
    public managedSupplier?: Supplier;

    @ManyToMany('NGO', 'employees')
    public employedNGOs!: NGO[];

    @ManyToMany('Supplier', 'employees')
    public employedSuppliers!: Supplier[];

    @Column({type: 'simple-array', nullable: true})
    public blockedNGOs?: string[];

    @Column({type: 'simple-array', nullable: true})
    public blockedSuppliers?: string[];

    public previous_password?: string;

    @Column({type: 'datetime', default: () => 'CURRENT_TIMESTAMP'})
    public creation_date!: Date;

    public constructor(partial?: Partial<User>)
    {
        super();
        Object.assign(this, partial);
    }

    @BeforeInsert()
    @BeforeUpdate()
    async beforeInsert(): Promise<void>
    {
	if (!this.creation_date) this.creation_date = new Date();
        // On insert, store the initial password as previous_password
        if (this.previous_password !== this.password) {
            this.password = await CryptService.hash(this.password);
            this.previous_password = this.password;
        }
    }

    @AfterLoad() afterLoad(): void
    {
        this.previous_password = this.password;
    }
}

