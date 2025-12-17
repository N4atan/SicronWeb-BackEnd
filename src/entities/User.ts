
import {AfterLoad, BeforeInsert, BeforeUpdate, Column, Entity, Generated, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn,} from 'typeorm';

import {CryptService} from '../services/CryptService';

import {NGO} from './NGO';
import {Supplier} from './Supplier';
import {UserDonationReceipt} from './UserDonationReceipt';

/**
 * Enumeration of available User Roles.
 */
export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',

    NGO_OWNER = 'ngoOwner' /* On Future */,
    NGO_MANAGER = 'ngoManager',
    NGO_EMPLOYER = 'ngoEmployer',

    SUPPLIER_OWNER = 'supplierOwner' /* On Future */,
    SUPPLIER_MANAGER = 'supplierManager',
    SUPPLIER_EMPLOYER = 'supplierEmployer',
}

/**
 * Entity representing a User in the system.
 */
@Entity('usertbl') export class User
{
    @PrimaryGeneratedColumn() public id?: number;

    @Column({unique: true, length: 36})
    @Generated('uuid')
    public uuid!: string;

    @Column({length: 127}) public username!: string;

    @Column({length: 255, unique: true}) public email!: string;

    @Column({length: 255}) public password!: string;

    @Column({type: 'enum', enum: UserRole, default: UserRole.USER})
    public role!: UserRole;

    // Owned/Managed Organization (One-to-One)
    @OneToOne(() => NGO, (ngo) => ngo.manager)
    public managedNGO?: NGO;

    @OneToOne(() => Supplier, (supplier) => supplier.manager)
    public managedSupplier?: Supplier;

    // Employment Relations (Many-to-Many)
    @ManyToMany(() => NGO)
    @JoinTable({
        name: 'user_ngo_employments',
        joinColumn: {name: 'user_uuid', referencedColumnName: 'uuid'},
        inverseJoinColumn:
            {name: 'ngo_uuid', referencedColumnName: 'uuid'},
    })
    public employedNGOs?: NGO[];

    @ManyToMany(() => Supplier)
    @JoinTable({
        name: 'user_supplier_employments',
        joinColumn: {name: 'user_uuid', referencedColumnName: 'uuid'},
        inverseJoinColumn:
            {name: 'supplier_uuid', referencedColumnName: 'uuid'},
    })
    public employedSuppliers?: Supplier[];

    // Block Lists (Simple Arrays of UUIDs)
    @Column('simple-array', {nullable: true})
    public blockedSuppliers?: string[];

    @Column('simple-array', {nullable: true})
    public blockedNGOs?: string[];

    @OneToMany(() => UserDonationReceipt, (receipt) => receipt.user)
    public donationReceipts?: UserDonationReceipt[];

    private previous_password!: string;

    @AfterLoad() private loadPreviousPassword(): void
    {
        this.previous_password = this.password;
    }

    @BeforeInsert()
    @BeforeUpdate()
    private async beforeInsert(): Promise<void>
    {
        if (this.password !== this.previous_password)
            this.password = await CryptService.hash(this.password);
    }

    public constructor(partial?: Partial<User>)
    {
        Object.assign(this, partial);
    }
}
