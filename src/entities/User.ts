import {AfterLoad, BeforeInsert, BeforeUpdate, Column, Entity, Generated, JoinColumn, ManyToMany, OneToOne, PrimaryGeneratedColumn,} from 'typeorm';

import {CryptService} from '../services/CryptService';

import {NGO} from './NGO';
import {Supplier} from './Supplier';

export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN',
    NGO_MANAGER = 'NGO_MANAGER',
    NGO_EMPLOYER = 'NGO_EMPLOYER',
    SUPPLIER_MANAGER = 'SUPPLIER_MANAGER',
    SUPPLIER_EMPLOYER = 'SUPPLIER_EMPLOYER',
}

@Entity('usertbl') export class User
{
    @PrimaryGeneratedColumn() public id?: number;

    @Column({unique: true, length: 36})
    @Generated('uuid')
    public uuid!: string;

    @Column() public username!: string;

    @Column({unique: true}) public email!: string;

    @Column() public password!: string;

    @Column({type: 'enum', enum: UserRole, default: UserRole.USER})
    public role!: UserRole;

    @OneToOne(() => NGO, (ngo) => ngo.manager)
    @JoinColumn(
        {name: 'managed_ngo_uuid', referencedColumnName: 'uuid'})
    public managedNGO?: NGO;

    @OneToOne(() => Supplier, (s) => s.manager)
    @JoinColumn(
        {name: 'managed_supplier_uuid', referencedColumnName: 'uuid'})
    public managedSupplier?: Supplier;

    @ManyToMany(() => NGO, (ngo) => ngo.employees)
    public employedNGOs!: NGO[];

    @ManyToMany(() => Supplier, (s) => s.employees)
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
        Object.assign(this, partial);
    }

    @BeforeInsert()
    @BeforeUpdate()
    async beforeInsert(): Promise<void>
    {
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
