import {Column, Entity, Generated, JoinColumn, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn,} from 'typeorm';

import {ApprovalStatus} from './ApprovalStatus';

import type {NGOProduct} from './NGOProduct';
import type {User} from './User';

/**
 * Entity representing a Non-Governmental Organization (NGO).
 */
@Entity('ngotbl') export class NGO
{
    @PrimaryGeneratedColumn() public id?: number;

    @Column({unique: true, length: 36})
    @Generated('uuid')
    public uuid!: string;

    @Column({unique: true}) public name!: string;

    @Column({unique: true}) public cnpj!: string;

    @Column({unique: true}) public trade_name!: string;

    @Column() public area!: string;

    @Column() public description!: string;

    @Column({type: 'decimal', precision: 10, scale: 2, default: 0})
    public wallet!: number;

    @Column({length: 100}) public local!: string;

    @Column({length: 15}) public phone_number!: string;

    @Column({length: 100}) public contact_email!: string;

    @Column({type: 'datetime', default: () => 'CURRENT_TIMESTAMP'})
    public creation_date!: Date;

    @Column({
        type: 'enum',
        enum: ApprovalStatus,
        default: ApprovalStatus.PENDING,
    })
    public status!: ApprovalStatus;

    @OneToOne(() => async () => (await import('./User')).User, {nullable: false, onDelete: 'CASCADE'})
    @JoinColumn({
        name: 'manager_uuid',
        referencedColumnName: 'uuid',
    })
    public manager!: User;

    @ManyToMany(() => async () => (await import('./User')).User, (user: User) => user.employedNGOs)
    public employees!: User[];

    @OneToMany('NGOProduct', 'ngo')
    public products!: NGOProduct[];

    public constructor(partial?: Partial<NGO>)
    {
        Object.assign(this, partial);
    }
}