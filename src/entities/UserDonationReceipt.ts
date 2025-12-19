import {Column, CreateDateColumn, Entity, Generated, JoinColumn, ManyToOne, PrimaryGeneratedColumn,} from 'typeorm';

import type {NGO} from './NGO';
import type {User} from './User';

/**
 * Entity representing a donation receipt uploaded by a User.
 */
@Entity('user_donation_receipts') export class UserDonationReceipt
{
    @PrimaryGeneratedColumn() public id!: number;

    @Column({unique: true, length: 36})
    @Generated('uuid')
    public uuid!: string;

    @ManyToOne('User')
    @JoinColumn({name: 'user_id'})
    public user!: User;

    @ManyToOne('NGO')
    @JoinColumn({name: 'ngo_id'})
    public ngo!: NGO;

    @Column() public fileUrl!: string;

    @Column('decimal', {precision: 10, scale: 2})
    public amount!: number;

    @CreateDateColumn({name: 'donation_date'})
    public donationDate!: Date;

    public constructor(partial?: Partial<UserDonationReceipt>)
    {
        Object.assign(this, partial);
    }
}