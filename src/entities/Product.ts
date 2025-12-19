import {Column, Entity, Generated, OneToMany, PrimaryGeneratedColumn,} from 'typeorm';

import type {NGOProduct} from './NGOProduct';
import type {SupplierProduct} from './SupplierProduct';

/**
 * Entity representing a generic Product definition in the system
 * (e.g., "Rice 5kg"). Actual offers and needs link to this entity.
 */
@Entity('products') export class Product
{
    @PrimaryGeneratedColumn() public id!: number;

    @Column({unique: true, length: 36})
    @Generated('uuid')
    public uuid!: string;

    @Column({unique: true}) public name!: string;

    @Column({nullable: true}) public description!: string;

    @Column({nullable: true}) public category!: string;

    @OneToMany('SupplierProduct', 'product')
    public supplierProducts!: SupplierProduct[];

    @OneToMany('NGOProduct', 'product')
    public ngoProducts!: NGOProduct[];

    public constructor(partial?: Partial<Product>)
    {
        Object.assign(this, partial);
    }
}
