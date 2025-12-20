import {Column, Entity, Generated, JoinColumn, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn,} from 'typeorm';

import {ApprovalStatus} from './ApprovalStatus';

import type {SupplierPaymentReceipt} from './SupplierPaymentReceipt';
import type {SupplierProduct} from './SupplierProduct';
import type {User} from './User';

/**
 * Entity representing a Supplier organization.
 */
@Entity('suppliers') export class Supplier
{
    @PrimaryGeneratedColumn() public id!: number;

    @Column({unique: true, length: 36})
    @Generated('uuid')
    public uuid!: string;

    @Column() public companyName!: string;

    @OneToOne('User', {nullable: false, onDelete: 'CASCADE'})
    @JoinColumn({
        name: 'manager_uuid',
        referencedColumnName: 'uuid',
    })
    public manager!: User;

    @ManyToMany('User', 'employedSuppliers')
    public employees!: User[];

    @Column() public tradeName!: string;

    @Column({unique: true, length: 14}) public cnpj!: string;

    @Column({nullable: true}) public stateRegistration!: string;

    @Column({nullable: true}) public municipalRegistration!: string;

    @Column({
        type: 'enum',
        enum:    ApprovalStatus,
        default: ApprovalStatus.PENDING,
    })
    public status!: ApprovalStatus;

    @Column() public contactEmail!: string;

    @Column({nullable: true}) public phone!: string;

    @Column({nullable: true}) public address!: string;

    @Column({nullable: true}) public city!: string;

    @Column({nullable: true}) public state!: string;

    @Column({nullable: true}) public postalCode!: string;

    @OneToMany('SupplierProduct', 'supplier')
    public products!: SupplierProduct[];

    @OneToMany('SupplierPaymentReceipt', 'supplier')
    public paymentReceipts!: SupplierPaymentReceipt[];

    public constructor(partial?: Partial<Supplier>)
    {
        Object.assign(this, partial);
    }
}
