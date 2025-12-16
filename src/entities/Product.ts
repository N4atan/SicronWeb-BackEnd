import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Generated } from 'typeorm';

import { SupplierProduct } from './SupplierProduct';
import { NGOProduct } from './NGOProduct';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({ unique: true, length: 36 })
  @Generated('uuid')
  public uuid!: string;

  @Column({ unique: true })
  public name!: string;

  @Column({ nullable: true })
  public description!: string;

  @Column({ nullable: true })
  public category!: string;

  @OneToMany(() => SupplierProduct, sp => sp.product)
  public supplierProducts!: SupplierProduct[];

  @OneToMany(() => NGOProduct, np => np.product)
  public ngoProducts!: NGOProduct[];

  public constructor(partial?: Partial<Product>) { Object.assign(this, partial) }
}
