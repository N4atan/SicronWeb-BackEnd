import {Column, Entity, JoinColumn, ManyToOne, Unique,} from 'typeorm';

import {GenericEntity} from '../types/GenericEntity';

import type {NGO} from './NGO';
import type {Product} from './Product';
import type {SupplierProduct} from './SupplierProduct';

/**
 * Entity representing a Product needed by an NGO within the SICRON ecosystem.
 * 
 * This entity serves as the bridge between NGOs and the general Product catalog,
 * representing specific needs or offers that NGOs have regarding products.
 * It can represent both needs (what an NGO requires) and offers (what an NGO
 * can provide) depending on the context. The entity implements the GenericEntity
 * pattern for secure dual-identifier management.
 * 
 * ## Key Features
 * 
 * ### Product Need Management
 * - Links NGOs to specific products in the catalog
 * - Tracks quantity requirements or availability
 * - Supports notes and special requirements
 * 
 * ### Relationship Management
 * - Many-to-one relationship with NGOs
 * - Many-to-one relationship with Products
 * - Optional relationship with SupplierProducts for fulfillment tracking
 * 
 * ### Business Logic Support
 * - Unique constraint preventing duplicate product needs per NGO
 * - Flexible quantity tracking for both needs and offers
 * - Optional supplier product association for fulfillment tracking
 * 
 * @example
 * ```typescript
 * // NGO needs products
 * const neededProducts = [
 *   new NGOProduct({
 *     ngo: educationNGO,
 *     product: riceProduct,
 *     quantity: 100,
 *     notes: 'Needed for school feeding program'
 *   }),
 *   new NGOProduct({
 *     ngo: educationNGO,
 *     product: notebooksProduct,
 *     quantity: 500,
 *     notes: 'For student supplies'
 *   })
 * ];
 * 
 * await ngoProductRepo.createAndSave(neededProducts);
 * ```
 * 
 * @example
 * ```typescript
 * // NGO offers products (surplus)
 * const offeredProducts = [
 *   new NGOProduct({
 *     ngo: healthNGO,
 *     product: medicineProduct,
 *     quantity: 50,
 *     notes: 'Surplus from previous donation'
 *   })
 * ];
 * 
 * // Track fulfillment with supplier product
 * const fulfilledNeed = new NGOProduct({
 *   ngo: educationNGO,
 *   product: riceProduct,
 *   quantity: 100,
 *   supplierProduct: supplierRiceOffer,
 *   notes: 'Fulfilled by ABC Distribuidora'
 * });
 * ```
 * 
 * @extends GenericEntity
 * @since 1.0.0
 * @version 1.1.0
 */
@Entity('ngo_products')
@Unique(['ngo', 'product'])
export class NGOProduct extends GenericEntity
{
    /**
     * NGO that needs or offers this product.
     * 
     * The organization entity that has expressed interest in this product,
     * either as a need (requirement) or offer (surplus availability).
     * This relationship enables need/offer matching and fulfillment tracking.
     * 
     * @example
     * ```typescript
     * // Access the NGO information
     * console.log(ngoProduct.ngo.name);      // 'Fundação Educação Para Todos'
     * console.log(ngoProduct.ngo.area);      // 'Educação'
     * console.log(ngoProduct.ngo.local);     // 'São Paulo, SP'
     * 
     * // Find all product needs for an NGO
     * const ngoNeeds = await ngoProductRepo.find({
     *   where: { ngo: targetNGO },
     *   relations: ['product']
     * });
     * 
     * // Group needs by NGO area
     * const needsByArea = ngoNeeds.reduce((acc, need) => {
     *   const area = need.ngo.area;
     *   if (!acc[area]) acc[area] = [];
     *   acc[area].push(need);
     *   return acc;
     * }, {});
     * ```
     * 
     * @relationship ManyToOne with NGO
     * @inverseSide 'products'
     * @required true
     */
    @ManyToOne('NGO', 'products')
    @JoinColumn({
        name: 'ngo_uuid',
        referencedColumnName: 'uuid'
    })
    public ngo!: NGO;

    /**
     * Product that the NGO needs or offers.
     * 
     * Reference to the generic Product definition from the master catalog.
     * This links the NGO's specific need/offer to the universal product
     * identification system used throughout the platform.
     * 
     * @example
     * ```typescript
     * // Access product information
     * console.log(ngoProduct.product.name);        // 'Arroz Branco 5kg'
     * console.log(ngoProduct.product.category);    // 'Alimentação'
     * console.log(ngoProduct.product.description); // 'Arroz polido tipo 1...'
     * 
     * // Find NGOs needing specific product
     * const ngosNeedingProduct = await ngoProductRepo.find({
     *   where: { product: targetProduct },
     *   relations: ['ngo']
     * });
     * 
     * // Calculate total quantity needed across all NGOs
     * const totalNeeded = ngosNeedingProduct
     *   .reduce((sum, np) => sum + np.quantity, 0);
     * ```
     * 
     * @relationship ManyToOne with Product
     * @required true
     */
    @ManyToOne('Product')
    @JoinColumn({
        name: 'ngo_needed_products_uuid',
        referencedColumnName: 'uuid',
    })
    public product!: Product;

    /**
     * Supplier product that fulfills this NGO need (optional).
     * 
     * Optional reference to a specific supplier product offer that can
     * fulfill this NGO's need. This enables tracking of fulfillment
     * status and connection between NGO needs and supplier offerings.
     * 
     * @example
     * ```typescript
     * // Track fulfillment status
     * if (ngoProduct.supplierProduct) {
     *   console.log(`Need fulfilled by: ${ngoProduct.supplierProduct.supplier.tradeName}`);
     *   console.log(`Price: R$ ${ngoProduct.supplierProduct.price}`);
     * } else {
     *   console.log('Need not yet fulfilled');
     * }
     * 
     * // Find unfulfilled needs
     * const unfulfilledNeeds = await ngoProductRepo.find({
     *   where: { supplierProduct: null },
     *   relations: ['ngo', 'product']
     * });
     * 
     * // Match needs with supplier offers
     * const potentialMatches = unfulfilledNeeds.filter(need => {
     *   return need.product.supplierProducts.some(sp => 
     *     sp.availableQuantity >= need.quantity
     *   );
     * });
     * ```
     * 
     * @relationship ManyToOne with SupplierProduct
     * @nullable true
     */
    @ManyToOne('SupplierProduct', {nullable: true})
    @JoinColumn({name: 'supplier_product_id'})
    public supplierProduct?: SupplierProduct;

    /**
     * Quantity needed or offered by the NGO.
     * 
     * Integer value representing the quantity of the product that the NGO
     * needs (for needs) or can provide (for offers). This enables quantity-
     * based matching between NGO needs and supplier offerings.
     * 
     * @example
     * ```typescript
     * // Various quantity scenarios
     * ngoProduct.quantity = 100;     // Need 100 units
     * ngoProduct.quantity = 1;       // Need 1 unit (large item)
     * ngoProduct.quantity = 1000;    // Need 1000 units (bulk)
     * 
     * // Quantity validation
     * if (ngoProduct.quantity <= 0) {
     *   throw new Error('Quantity must be positive');
     * }
     * 
     * // Check if supplier can fulfill entire need
     * if (ngoProduct.supplierProduct) {
     *   const canFulfill = ngoProduct.supplierProduct.availableQuantity >= ngoProduct.quantity;
     *   console.log(`Can fulfill: ${canFulfill}`);
     * }
     * ```
     * 
     * @minimum 1
     * @type integer
     * @required true
     */
    @Column('int') 
    public quantity!: number;

    /**
     * Additional notes or requirements for the product.
     * 
     * Optional text field for NGO to provide additional context about
     * their product need, such as quality requirements, delivery
     * preferences, urgency, or special specifications.
     * 
     * @example
     * ```typescript
     * // Various note scenarios
     * ngoProduct.notes = 'Needed for school feeding program - urgent delivery required';
     * ngoProduct.notes = 'Organic certification preferred';
     * ngoProduct.notes = 'Can accept partial deliveries';
     * ngoProduct.notes = 'For emergency relief - delivery within 48 hours';
     * 
     * // Search by notes content
     * const urgentNeeds = await ngoProductRepo
     *   .createQueryBuilder('np')
 *       .where('np.notes ILIKE :searchTerm', { searchTerm: '%urgent%' })
 *       .getMany();
     * ```
     * 
     * @nullable true
     * @maxLength 1000
     */
    @Column({nullable: true}) 
    public notes?: string;

    /**
     * Constructor for creating NGOProduct instances.
     * 
     * Initializes a new NGOProduct entity with optional partial data.
     * Automatically calls parent constructor to initialize GenericEntity fields.
     * 
     * @param partial - Optional partial NGOProduct data for initialization
     * 
     * @example
     * ```typescript
     * // Create empty NGO product
     * const ngoProduct = new NGOProduct();
     * 
     * // Create with basic need
     * const need = new NGOProduct({
     *   ngo: organization,
     *   product: catalogProduct,
     *   quantity: 50,
     *   notes: 'Monthly requirement'
     * });
     * 
     * // Create with fulfillment tracking
     * const fulfilled = new NGOProduct({
     *   ngo: organization,
     *   product: catalogProduct,
     *   quantity: 100,
     *   supplierProduct: supplierOffer,
     *   notes: 'Fulfilled by ABC Supplier'
     * });
     * ```
     */
    public constructor(partial: Partial<NGOProduct>)
    {
        super();
        Object.assign(this, partial);
    }

    /**
     * Check if this NGO product need is fulfilled.
     * 
     * Determines whether the NGO's product need has been associated
     * with a supplier product offer for fulfillment.
     * 
     * @returns True if need is fulfilled (has supplier product), false otherwise
     * 
     * @example
     * ```typescript
     * if (ngoProduct.isFulfilled()) {
     *   console.log('Need fulfilled by supplier');
     * } else {
     *   console.log('Need still pending');
     * }
     * ```
     */
    public isFulfilled(): boolean
    {
        return this.supplierProduct !== null && this.supplierProduct !== undefined;
    }

    /**
     * Get the total cost if fulfilled by a supplier.
     * 
     * Calculates the total cost by multiplying quantity by supplier price
     * if this need has been fulfilled with a supplier product.
     * 
     * @returns Total cost or null if not fulfilled
     * 
     * @example
     * ```typescript
     * const totalCost = ngoProduct.getTotalCost();
     * if (totalCost !== null) {
     *   console.log(`Total cost: R$ ${totalCost.toFixed(2)}`);
     * }
     * ```
     */
    public getTotalCost(): number | null
    {
        if (!this.supplierProduct) return null;
        return this.quantity * this.supplierProduct.price;
    }

    /**
     * Check if quantity requirement can be met by current supplier offer.
     * 
     * Validates whether the supplier product has sufficient available
     * quantity to fulfill the NGO's requirement.
     * 
     * @returns True if supplier can fulfill the quantity, false otherwise
     * 
     * @example
     * ```typescript
     * if (ngoProduct.canFulfillQuantity()) {
     *   console.log('Supplier can fulfill entire quantity');
     * } else {
     *   console.log('Insufficient quantity available');
     * }
     * ```
     */
    public canFulfillQuantity(): boolean
    {
        if (!this.supplierProduct) return false;
        return this.supplierProduct.availableQuantity >= this.quantity;
    }

    /**
     * Get urgency level based on notes content.
     * 
     * Analyzes the notes field to determine urgency level for
     * prioritization and matching algorithms.
     * 
     * @returns Urgency level string
     * 
     * @example
     * ```typescript
     * const urgency = ngoProduct.getUrgencyLevel();
     * // Returns: 'urgent', 'high', 'normal', or 'low'
     * ```
     */
    public getUrgencyLevel(): string
    {
        if (!this.notes) return 'normal';
        
        const notes = this.notes.toLowerCase();
        if (notes.includes('urgent') || notes.includes('emergenc')) return 'urgent';
        if (notes.includes('asap') || notes.includes('quick')) return 'high';
        if (notes.includes('slow') || notes.includes('flexible')) return 'low';
        return 'normal';
    }
}

