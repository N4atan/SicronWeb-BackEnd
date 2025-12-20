import {Column, Entity, JoinColumn, ManyToOne, Unique,} from 'typeorm';

import {GenericEntity} from '../types/GenericEntity';

import type {Product} from './Product';
import type {Supplier} from './Supplier';

/**
 * Entity representing a Product offered by a Supplier within the SICRON ecosystem.
 * 
 * This entity serves as the bridge between Suppliers and the general Product catalog,
 * representing specific product offerings with pricing, availability, and delivery
 * information. It enables the supplier marketplace functionality where suppliers
 * can offer products to NGOs with competitive pricing and service terms. The entity
 * implements the GenericEntity pattern for secure dual-identifier management.
 * 
 * ## Key Features
 * 
 * ### Product Offering Management
 * - Links Suppliers to specific products in the catalog
 * - Tracks pricing and availability information
 * - Manages delivery time estimates
 * 
 * ### Business Relationship Management
 * - Many-to-one relationship with Suppliers
 * - Many-to-one relationship with Products
 * - Unique constraint preventing duplicate offerings per supplier
 * 
 * ### Marketplace Functionality
 * - Competitive pricing support
 * - Inventory tracking
 * - Delivery performance metrics
 * 
 * @example
 * ```typescript
 * // Supplier offers products with pricing
 * const supplierProducts = [
 *   new SupplierProduct({
 *     supplier: abcSupplier,
 *     product: riceProduct,
 *     price: 18.50,
 *     availableQuantity: 1000,
 *     avgDeliveryTimeDays: 3
 *   }),
 *   new SupplierProduct({
 *     supplier: abcSupplier,
 *     product: notebooksProduct,
 *     price: 12.75,
 *     availableQuantity: 500,
 *     avgDeliveryTimeDays: 5
 *   })
 * ];
 * 
 * await supplierProductRepo.createAndSave(supplierProducts);
 * ```
 * 
 * @example
 * ```typescript
 * // Product catalog with multiple suppliers
 * const riceProduct = await productRepo.findOne({
 *   where: { name: 'Arroz Branco 5kg' },
 *   relations: ['supplierProducts', 'supplierProducts.supplier']
 * });
 * 
 * // Compare supplier offerings
 * riceProduct.supplierProducts.forEach(sp => {
 *   console.log(`${sp.supplier.tradeName}: R$ ${sp.price} (${sp.availableQuantity} units, ${sp.avgDeliveryTimeDays} days)`);
 * });
 * 
 * // Find best price
 * const cheapest = riceProduct.supplierProducts.reduce((best, current) => 
 *   current.price < best.price ? current : best
 * );
 * ```
 * 
 * @extends GenericEntity
 * @since 1.0.0
 * @version 1.1.0
 */
@Entity('supplier_products')
@Unique(['supplier', 'product'])
export class SupplierProduct extends GenericEntity
{
    /**
     * Supplier offering this product.
     * 
     * The business entity that is offering this product for sale to NGOs.
     * This relationship enables supplier-specific product management and
     * supplier performance tracking.
     * 
     * @example
     * ```typescript
     * // Access supplier information
     * console.log(supplierProduct.supplier.companyName); // 'ABC Distribuidora Ltda'
     * console.log(supplierProduct.supplier.tradeName);   // 'ABC Distribuidora'
     * console.log(supplierProduct.supplier.contactEmail); // 'vendas@abcdistribuidora.com'
     * 
     * // Find all products offered by a supplier
     * const supplierOffers = await supplierProductRepo.find({
     *   where: { supplier: targetSupplier },
     *   relations: ['product']
     * });
     * 
     * // Calculate supplier's total inventory value
     * const totalInventoryValue = supplierOffers.reduce((total, offer) => 
     *   total + (offer.price * offer.availableQuantity), 0
     * );
     * ```
     * 
     * @relationship ManyToOne with Supplier
     * @inverseSide 'products'
     * @cascade CASCADE delete
     * @required true
     */
    @ManyToOne('Supplier', 'products', {
        onDelete: 'CASCADE',
    })
    @JoinColumn({name: 'supplier_id'})
    public supplier!: Supplier;

    /**
     * Product being offered by the supplier.
     * 
     * Reference to the generic Product definition from the master catalog.
     * This links the supplier's specific offering to the universal product
     * identification system used throughout the platform.
     * 
     * @example
     * ```typescript
     * // Access product information
     * console.log(supplierProduct.product.name);        // 'Arroz Branco 5kg'
     * console.log(supplierProduct.product.category);    // 'Alimentação'
     * console.log(supplierProduct.product.description); // 'Arroz polido tipo 1...'
     * 
     * // Find all suppliers offering a specific product
     * const suppliersOfferingProduct = await supplierProductRepo.find({
     *   where: { product: targetProduct },
     *   relations: ['supplier']
     * });
     * 
     * // Get price comparison for a product
     * const priceComparison = suppliersOfferingProduct.map(sp => ({
     *   supplier: sp.supplier.tradeName,
     *   price: sp.price,
     *   deliveryTime: sp.avgDeliveryTimeDays,
     *   availability: sp.availableQuantity
     * }));
     * ```
     * 
     * @relationship ManyToOne with Product
     * @inverseSide 'supplierProducts'
     * @cascade CASCADE delete
     * @required true
     */
    @ManyToOne('Product', 'supplierProducts', {
        onDelete: 'CASCADE',
    })
    @JoinColumn({name: 'product_id'})
    public product!: Product;

    /**
     * Price per unit in Brazilian Real (BRL).
     * 
     * Unit price at which the supplier offers this product to NGOs.
     * Supports decimal precision for accurate pricing calculations
     * and competitive market analysis.
     * 
     * @example
     * ```typescript
     * // Various pricing scenarios
     * supplierProduct.price = 18.50;     // R$ 18.50 per unit
     * supplierProduct.price = 1250.00;   // R$ 1,250.00 per unit (bulk item)
     * supplierProduct.price = 0.75;      // R$ 0.75 per unit (small item)
     * 
     * // Calculate total cost for NGO need
     * const ngoNeed = { quantity: 100 };
     * const totalCost = supplierProduct.price * ngoNeed.quantity;
     * console.log(`Total cost for ${ngoNeed.quantity} units: R$ ${totalCost.toFixed(2)}`);
     * 
     * // Compare prices across suppliers
     * const priceDifference = supplierProduct.price - competitorPrice;
     * const percentageDifference = (priceDifference / competitorPrice) * 100;
     * console.log(`Price difference: ${percentageDifference.toFixed(2)}%`);
     * ```
     * 
     * @precision 10,2
     * @minimum 0.01
     * @currency BRL
     * @required true
     */
    @Column('decimal', {precision: 10, scale: 2})
    public price!: number;

    /**
     * Current available quantity for immediate purchase.
     * 
     * Integer value representing the current stock level available
     * for immediate sale to NGOs. This enables real-time inventory
     * tracking and availability checking for marketplace functionality.
     * 
     * @example
     * ```typescript
     * // Various availability scenarios
     * supplierProduct.availableQuantity = 1000;   // High stock
     * supplierProduct.availableQuantity = 50;     // Low stock
     * supplierProduct.availableQuantity = 0;      // Out of stock
     * supplierProduct.availableQuantity = 10000;  // Bulk availability
     * 
     * // Check if supplier can fulfill NGO need
     * const canFulfill = supplierProduct.availableQuantity >= ngoRequiredQuantity;
     * 
     * // Stock level warnings
     * if (supplierProduct.availableQuantity < 10) {
     *   console.log('Low stock warning for product:', supplierProduct.product.name);
     * }
     * 
     * // Calculate total value of available inventory
     * const inventoryValue = supplierProduct.price * supplierProduct.availableQuantity;
     * ```
     * 
     * @minimum 0
     * @type integer
     * @required true
     */
    @Column('int') 
    public availableQuantity!: number;

    /**
     * Average delivery time in days.
     * 
     * Estimated number of days required for delivery after order placement.
     * This enables NGOs to make informed decisions based on delivery
     * timelines and urgency requirements.
     * 
     * @example
     * ```typescript
     * // Various delivery time scenarios
     * supplierProduct.avgDeliveryTimeDays = 1;    // Same day delivery
     * supplierProduct.avgDeliveryTimeDays = 3;    // Standard delivery
     * supplierProduct.avgDeliveryTimeDays = 7;    // Extended delivery
     * supplierProduct.avgDeliveryTimeDays = 14;   // Long-term delivery
     * 
     * // Delivery time assessment
     * if (supplierProduct.avgDeliveryTimeDays <= 3) {
     *   console.log('Fast delivery available');
     * } else if (supplierProduct.avgDeliveryTimeDays <= 7) {
     *   console.log('Standard delivery');
     * } else {
     *   console.log('Extended delivery time');
     * }
     * 
     * // Calculate delivery date for urgent orders
     * const estimatedDeliveryDate = new Date();
     * estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + supplierProduct.avgDeliveryTimeDays);
     * console.log(`Estimated delivery: ${estimatedDeliveryDate.toLocaleDateString('pt-BR')}`);
     * ```
     * 
     * @minimum 1
     * @maximum 365
     * @type integer
     * @required true
     */
    @Column('int') 
    public avgDeliveryTimeDays!: number;

    /**
     * Constructor for creating SupplierProduct instances.
     * 
     * Initializes a new SupplierProduct entity with optional partial data.
     * Automatically calls parent constructor to initialize GenericEntity fields.
     * 
     * @param partial - Optional partial SupplierProduct data for initialization
     * 
     * @example
     * ```typescript
     * // Create empty supplier product
     * const supplierProduct = new SupplierProduct();
     * 
     * // Create with basic offering
     * const productOffer = new SupplierProduct({
     *   supplier: currentSupplier,
     *   product: catalogProduct,
     *   price: 25.00,
     *   availableQuantity: 100,
     *   avgDeliveryTimeDays: 5
     * });
     * 
     * // Create with competitive pricing
     * const competitiveOffer = new SupplierProduct({
     *   supplier: abcSupplier,
     *   product: riceProduct,
     *   price: 17.99,  // Competitive price
     *   availableQuantity: 500,
     *   avgDeliveryTimeDays: 2   // Fast delivery
     * });
     * ```
     */
    public constructor(partial?: Partial<SupplierProduct>)
    {
        super();
        Object.assign(this, partial);
    }

    /**
     * Get formatted price for display.
     * 
     * Helper method to format the price as Brazilian currency
     * for financial reports and user interface display.
     * 
     * @returns Formatted currency string
     * 
     * @example
     * ```typescript
     * const formatted = supplierProduct.getFormattedPrice();
     * console.log(formatted); // 'R$ 18,50'
     * ```
     */
    public getFormattedPrice(): string
    {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(this.price);
    }

    /**
     * Check if product is currently available for purchase.
     * 
     * Determines whether the supplier has available quantity
     * for immediate purchase by NGOs.
     * 
     * @returns True if available (quantity > 0), false otherwise
     * 
     * @example
     * ```typescript
     * if (supplierProduct.isAvailable()) {
     *   console.log('Product available for purchase');
     * } else {
     *   console.log('Product currently out of stock');
     * }
     * ```
     */
    public isAvailable(): boolean
    {
        return this.availableQuantity > 0;
    }

    /**
     * Calculate total value of available inventory.
     * 
     * Multiplies the available quantity by the unit price
     * to determine the total monetary value of current stock.
     * 
     * @returns Total inventory value
     * 
     * @example
     * ```typescript
     * const inventoryValue = supplierProduct.getInventoryValue();
     * console.log(`Total inventory value: R$ ${inventoryValue.toFixed(2)}`);
     * ```
     */
    public getInventoryValue(): number
    {
        return this.price * this.availableQuantity;
    }

    /**
     * Check if can fulfill specified quantity.
     * 
     * Validates whether the supplier has sufficient available
     * quantity to fulfill a specific order quantity.
     * 
     * @param requiredQuantity - Quantity required for the order
     * @returns True if available quantity >= required quantity
     * 
     * @example
     * ```typescript
     * if (supplierProduct.canFulfillQuantity(50)) {
     *   console.log('Can fulfill order for 50 units');
     * } else {
     *   console.log('Insufficient quantity available');
     * }
     * ```
     */
    public canFulfillQuantity(requiredQuantity: number): boolean
    {
        return this.availableQuantity >= requiredQuantity;
    }

    /**
     * Get delivery category based on average delivery time.
     * 
     * Categorizes the delivery speed for quick comparison
     * and filtering purposes.
     * 
     * @returns Delivery speed category
     * 
     * @example
     * ```typescript
     * const deliveryCategory = supplierProduct.getDeliveryCategory();
     * // Returns: 'same-day', 'fast', 'standard', 'slow', or 'long-term'
     * ```
     */
    public getDeliveryCategory(): string
    {
        if (this.avgDeliveryTimeDays <= 1) return 'same-day';
        if (this.avgDeliveryTimeDays <= 3) return 'fast';
        if (this.avgDeliveryTimeDays <= 7) return 'standard';
        if (this.avgDeliveryTimeDays <= 14) return 'slow';
        return 'long-term';
    }

    /**
     * Calculate estimated delivery date for new orders.
     * 
     * Provides an estimated delivery date based on the average
     * delivery time from the current date.
     * 
     * @returns Estimated delivery date
     * 
     * @example
     * ```typescript
     * const estimatedDate = supplierProduct.getEstimatedDeliveryDate();
     * console.log(`Estimated delivery: ${estimatedDate.toLocaleDateString('pt-BR')}`);
     * ```
     */
    public getEstimatedDeliveryDate(): Date
    {
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + this.avgDeliveryTimeDays);
        return deliveryDate;
    }

    /**
     * Get stock status level for inventory management.
     * 
     * Categorizes the current stock level for inventory
     * monitoring and reorder point management.
     * 
     * @returns Stock status level
     * 
     * @example
     * ```typescript
     * const stockStatus = supplierProduct.getStockStatus();
     * // Returns: 'out-of-stock', 'low', 'normal', 'high', or 'bulk'
     * ```
     */
    public getStockStatus(): string
    {
        if (this.availableQuantity === 0) return 'out-of-stock';
        if (this.availableQuantity <= 10) return 'low';
        if (this.availableQuantity <= 100) return 'normal';
        if (this.availableQuantity <= 1000) return 'high';
        return 'bulk';
    }

    /**
     * Calculate potential revenue for full inventory sale.
     * 
     * Estimates the total revenue that could be generated
     * if all currently available quantity were sold.
     * 
     * @returns Potential total revenue
     * 
     * @example
     * ```typescript
     * const potentialRevenue = supplierProduct.getPotentialRevenue();
     * console.log(`Potential revenue if all sold: R$ ${potentialRevenue.toFixed(2)}`);
     * ```
     */
    public getPotentialRevenue(): number
    {
        return this.price * this.availableQuantity;
    }
}

