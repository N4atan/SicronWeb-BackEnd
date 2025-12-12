import { Entity, Unique, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

import { NGO     } from './NGO';
import { Product } from './Product';

@Entity('ngo_products')
@Unique(['ngo', 'product'])
export class NGOProduct {
  @PrimaryGeneratedColumn()
  public id!: number;

  @ManyToOne(() => NGO, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ngo_id' })
  public ngo!: NGO;

  @ManyToOne(() => Product, product => product.ngoProducts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  public product!: Product;

  @Column('int')
  public requiredQuantity!: number;

  public constructor(partial?: Partial<NGOProduct>) { Object.assign(this, partial) }
};