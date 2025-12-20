import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique} from 'typeorm';

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
    @PrimaryGeneratedColumn() public id!: number;

    @ManyToOne('NGO', 'products')
    @JoinColumn({
        name: 'ngo_uuid',
        referencedColumnName: 'uuid'
    })
    public ngo!: NGO;

    @ManyToOne('Product')
    @JoinColumn({
        name: 'ngo_needed_products_uuid',
        referencedColumnName: 'uuid',
    })
    public product!: Product;

    @ManyToOne('SupplierProduct', {nullable: true})
    @JoinColumn({name: 'supplier_product_id'})
    public supplierProduct?: SupplierProduct;

    @Column('int') public quantity!: number;

    @Column({nullable: true}) public notes?: string;

    public constructor(partial: Partial<NGOProduct>)
    {
        Object.assign(this, partial);
    }
}
