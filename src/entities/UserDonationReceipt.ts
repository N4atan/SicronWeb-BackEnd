import { Entity, Generated, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, OneToMany } from 'typeorm';

import { User } from './User';
import { NGO } from './NGO';
import { Product } from './Product';
import { UserDonationItem } from './UserDonationItem';

@Entity('user_donation_receipts')
export class UserDonationReceipt {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ unique: true, length: 36 })
  @Generated('uuid')
  public uuid!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  public user!: User;

  @ManyToOne(() => NGO, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ngo_id' })
  public ngo!: NGO;

  @OneToMany(() => UserDonationItem, (item) => item.donationReceipt, { cascade: true })
  public items!: UserDonationItem[];

  @Column()
  public fileUrl!: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true, default: 0 })
  public amount!: number;

  @CreateDateColumn({ name: 'donation_date' })
  public donationDate!: Date;

  constructor(props: Omit<UserDonationReceipt, 'id' | 'uuid' | 'donationDate' | 'items'>) {
    Object.assign(this, props);
  }
};