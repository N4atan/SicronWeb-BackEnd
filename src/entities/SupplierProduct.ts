import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique,} from 'typeorm';

import {Product} from './Product';
import {Supplier} from './Supplier';

/**
 * Entity representing a Product offered by a Supplier.
 * Links a specific Supplier to a generic Product definition, with
 * price and availability.
 */
@Entity('supplier_products')
@Unique(['supplier', 'product'])
export class SupplierProduct
{
    @PrimaryGeneratedColumn() public id!: number;

    @ManyToOne(() => Supplier, (supplier) => supplier.products, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({name: 'supplier_id'})
    public supplier!: Supplier;

    @ManyToOne(() => Product, (product) => product.supplierProducts, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({name: 'product_id'})
    public product!: Product;

    @Column('decimal', {precision: 10, scale: 2})
    public price!: number;

    @Column('int') public availableQuantity!: number;

    @Column('int') public avgDeliveryTimeDays!: number;

    public constructor(partial?: Partial<SupplierProduct>)
    {
        Object.assign(this, partial);
    }
}
