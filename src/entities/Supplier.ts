import { Entity, Generated, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import { SupplierProduct        } from './SupplierProduct';
import { SupplierPaymentReceipt } from './SupplierPaymentReceipt';

@Entity('suppliers')
export class Supplier {
  @PrimaryGeneratedColumn()
  public id!: number

  @Column({ unique: true, length: 36 })
  @Generated('uuid')
  public uuid!: string

  @Column()
  public companyName!: string

  @Column()
  public tradeName!: string

  @Column({ unique: true, length: 14 })
  public cnpj!: string

  @Column({ nullable: true })
  public stateRegistration!: string

  @Column({ nullable: true })
  public municipalRegistration!: string

  @Column()
  public contactEmail!: string

  @Column({ nullable: true })
  public phone!: string

  @Column({ nullable: true })
  public address!: string

  @Column({ nullable: true })
  public city!: string

  @Column({ nullable: true })
  public state!: string

  @Column({ nullable: true })
  public postalCode!: string

  @OneToMany(() => SupplierProduct, sp => sp.supplier)
  public products!: SupplierProduct[]

  @OneToMany(() => SupplierPaymentReceipt, pr => pr.supplier)
  public paymentReceipts!: SupplierPaymentReceipt[]

  public constructor(partial?: Partial<Supplier>)
  {
    Object.assign(this, partial)
  }
};