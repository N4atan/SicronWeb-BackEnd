import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique,} from 'typeorm';

import type {NGO} from './NGO';
import type {Product} from './Product';
import type {SupplierProduct} from './SupplierProduct';

/**
 * Entity representing a Product needed by an NGO.
 * This links an NGO to a generic Product definition, with specific
 * quantity and notes.
 */
@Entity('ngo_products')
@Unique(['ngo', 'product'])
export class NGOProduct
{
    @PrimaryGeneratedColumn() id!: number;

    @ManyToOne(
        () => async () => (await import('./NGO')).NGO, (ngo: NGO) => ngo.products, {onDelete: 'CASCADE'})
    ngo!: NGO;

    @ManyToOne('Product')
    @JoinColumn({
        name: 'ngo_needed_products_uuid',
        referencedColumnName: 'uuid',
    })
    product!: Product;

    @ManyToOne('SupplierProduct', {nullable: true})
    @JoinColumn({name: 'supplier_product_id'})
    supplierProduct?: SupplierProduct;

    @Column('int') quantity!: number;

    @Column({nullable: true}) notes?: string;

    public constructor(partial: Partial<NGOProduct>)
    {
        Object.assign(this, partial);
    }
}
