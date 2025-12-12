import { Entity, Generated, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';

import { Supplier } from './Supplier';

@Entity('supplier_payment_receipts')
export class SupplierPaymentReceipt {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({unique: true, length: 36})
  @Generated('uuid')
  public uuid!: string;

  @ManyToOne(() => Supplier, supplier => supplier.paymentReceipts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'supplier_id' })
  public supplier!: Supplier;

  @Column()
  public fileUrl!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  public amount!: number;

  @CreateDateColumn({ name: 'payment_date' })
  public paymentDate!: Date;

  public constructor(partial?: Partial<SupplierPaymentReceipt>) { Object.assign(this, partial) }
};