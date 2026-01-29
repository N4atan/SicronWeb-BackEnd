
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Product } from "./Product";
import { UserDonationReceipt } from "./UserDonationReceipt";

@Entity('user_donation_items')
export class UserDonationItem {

    @PrimaryGeneratedColumn('uuid')
    public uuid!: string;

    @Column('int')
    public quantity!: number;

    @ManyToOne(() => Product, { eager: true })
    @JoinColumn({ name: 'product_id' })
    public product!: Product;

    @ManyToOne(() => UserDonationReceipt, (receipt) => receipt.items, { onDelete: 'CASCADE', orphanedRowAction: 'delete' })
    @JoinColumn({ name: 'donation_receipt_id' })
    public donationReceipt!: UserDonationReceipt;

    constructor(props: Omit<UserDonationItem, 'uuid'>) {
        Object.assign(this, props);
    }
}
