import { Entity, Unique, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

import { Supplier } from './Supplier';
import { Product } from './Product';

@Entity('supplier_products')
@Unique(['supplier', 'product_id'])
export class SupplierProduct {
  @PrimaryGeneratedColumn()
  public id!: number;

  @ManyToOne(() => Supplier, supplier => supplier.products, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'supplier_id' })
  public supplier!: Supplier;

  @ManyToOne(() => Product, product => product.supplierProducts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  public product!: Product;

  @Column('decimal', { precision: 10, scale: 2 })
  public price!: number;

  @Column('int')
  public availableQuantity!: number;

  public constructor(partial?: Partial<SupplierProduct>) { Object.assign(this, partial) }
};