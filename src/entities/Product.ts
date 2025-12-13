import { Entity, PrimaryGeneratedColumn, Column, OneToMany, PrimaryColumn } from 'typeorm';

import { SupplierProduct } from './SupplierProduct';
import { NGOProduct      } from './NGOProduct';

@Entity('products')
export class Product {
  @PrimaryColumn()
  public name!: string;

  @Column({ nullable: true })
  public description!: string;

  @OneToMany(() => SupplierProduct, sp => sp.product)
  public supplierProducts!: SupplierProduct[];

  @OneToMany(() => NGOProduct, np => np.product)
  public ngoProducts!: NGOProduct[];

  public constructor(partial?: Partial<Product>) { Object.assign(this, partial) }
}