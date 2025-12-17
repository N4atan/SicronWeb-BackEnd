import { Entity, Unique, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

import { NGO } from './NGO';
import { Product } from './Product';

@Entity('ngo_products')
@Unique(['ngo', 'product'])
export class NGOProduct {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => NGO, ngo => ngo.products)
  ngo!: NGO;

  @ManyToOne(() => Product)
  @JoinColumn({
    name: 'ngo_needed_products_uuid',
    referencedColumnName: 'uuid'
  })
  product!: Product;

  @Column('int')
  quantity!: number;

  @Column('int', { default: 0 })
  public collected_quantity!: number;

  @Column({ nullable: true })
  notes?: string;

  public constructor(partial: Partial<NGOProduct>) { Object.assign(this, partial); }
}
