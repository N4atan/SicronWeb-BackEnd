import {Column, Entity, OneToMany,} from 'typeorm';

import {GenericEntity} from '../types/GenericEntity';

import type {NGOProduct} from './NGOProduct';
import type {SupplierProduct} from './SupplierProduct';

/**
 * Entity representing a generic Product definition in the SICRON system.
 * 
 * This entity serves as the master catalog of all products that can be
 * referenced by both NGOs (as needs/offers) and Suppliers (as offerings).
 * It represents the abstract concept of a product (e.g., "Rice 5kg", "School Supplies")
 * while leaving specific details like pricing and availability to related entities.
 * 
 * The entity implements the GenericEntity pattern for secure dual-identifier management
 * and serves as the foundation for the product catalog system.
 * 
 * ## Key Features
 * 
 * ### Universal Product Reference
 * - Single source of truth for product definitions
 * - Cross-platform product identification
 * - Consistent naming and categorization
 * 
 * ### Relationship Management
 * - Many-to-many relationship with Suppliers through SupplierProduct
 * - Many-to-many relationship with NGOs through NGOProduct
 * - Flexible product categorization system
 * 
 * ### Search and Discovery
 * - Unique product names for precise identification
 * - Category-based product grouping
 * - Searchable description fields
 * 
 * @example
 * ```typescript
 * // Creating a basic product
 * const product = new Product({
 *   name: 'Arroz Branco 5kg',
 *   description: 'Arroz branco polido tipo 1, embalagem de 5kg',
 *   category: 'Alimentação'
 * });
 * 
 * await productRepo.createAndSave(product);
 * ```
 * 
 * @example
 * ```typescript
 * // Product catalog organization
 * const products = [
 *   new Product({
 *     name: 'Caderno Universitário 200 páginas',
 *     description: 'Caderno universitário espiral, 200 páginas, papel 75g',
 *     category: 'Material Escolar'
 *   }),
 *   new Product({
 *     name: 'Caneta Esferográfica Azul',
 *     description: 'Caneta esferográfica tinta azul, ponta média 0.7mm',
 *     category: 'Material Escolar'
 *   }),
 *   new Product({
 *     name: 'Leite Integral UHT 1L',
 *     description: 'Leite integral UHT, embalagem tetrapak 1 litro',
 *     category: 'Alimentação'
 *   })
 * ];
 * ```
 * 
 * @extends GenericEntity
 * @since 1.0.0
 * @version 1.1.0
 */
@Entity('products') 
export class Product extends GenericEntity
{
    /**
     * Unique name identifier for the product.
     * 
     * This is the primary display name used throughout the system to identify
     * the product. Should be descriptive and include key specifications like
     * size, weight, or type. Must be unique across all products in the catalog.
     * 
     * @example
     * ```typescript
     * product.name = 'Arroz Branco Tipo 1 - 5kg'
     * product.name = 'Caderno Universitário 200 páginas'
     * product.name = 'Uniforme Escolar - Camiseta P'
     * ```
     * 
     * @unique true
     * @required true
     */
    @Column({unique: true}) 
    public name!: string;

    /**
     * Detailed description of the product.
     * 
     * Comprehensive text providing additional information about the product
     * such as specifications, features, materials, usage instructions, or
     * quality standards. Used for searchability and detailed product information.
     * 
     * @example
     * ```typescript
     * product.description = 'Arroz polido tipo 1, grãos longos, livre de impurezas. 
     * Ideal para preparações culinárias diversas. Embalagem a vácuo de 5kg 
     * que preserva frescor e qualidade.';
     * 
     * product.description = 'Caderno universitário com 200 páginas pautadas, 
     * capa resistente, espiral niquelada e papel offset 75g. 
     * Dimensões: 20cm x 27cm.';
     * ```
     * 
     * @nullable true
     * @maxLength 2000
     */
    @Column({nullable: true}) 
    public description!: string;

    /**
     * Product category for organization and filtering.
     * 
     * Categorical classification used to group similar products together.
     * Enables efficient product browsing, filtering, and reporting.
     * Examples: Alimentação, Material Escolar, Roupas, Medicamentos, etc.
     * 
     * @example
     * ```typescript
     * product.category = 'Alimentação'        // Food items
     * product.category = 'Material Escolar'   // School supplies
     * product.category = 'Higiene Pessoal'    // Personal hygiene
     * product.category = 'Roupas'             // Clothing
     * product.category = 'Ferramentas'        // Tools
     * ```
     * 
     * @nullable true
     * @index true  // For efficient category-based queries
     */
    @Column({nullable: true}) 
    public category!: string;

    /**
     * Collection of supplier-specific product offerings.
     * 
     * Represents all instances where this product is offered by different suppliers,
     * each with potentially different pricing, availability, and specifications.
     * This relationship enables the supplier marketplace functionality.
     * 
     * @example
     * ```typescript
     * // Access all supplier offerings for this product
     * product.supplierProducts.forEach(supplierProduct => {
     *   console.log(`${supplierProduct.supplier.tradeName}: R$ ${supplierProduct.price}`);
     * });
     * 
     * // Find specific supplier offering
     * const abcOffer = product.supplierProducts.find(
     *   sp => sp.supplier.tradeName === 'ABC Distribuidora'
     * );
     * 
     * // Calculate average price
     * const avgPrice = product.supplierProducts
     *   .reduce((sum, sp) => sum + sp.price, 0) / product.supplierProducts.length;
     * ```
     * 
     * @relationship OneToMany with SupplierProduct
     * @inverseSide 'product'
     * @lazy true  // Load on demand for performance
     */
    @OneToMany('SupplierProduct', 'product')
    public supplierProducts!: SupplierProduct[];

    /**
     * Collection of NGO-specific product references.
     * 
     * Represents all instances where this product is referenced by NGOs,
     * whether as needs (what they require) or offers (what they can provide).
     * This relationship enables the NGO matching and donation system.
     * 
     * @example
     * ```typescript
     * // Access all NGO references for this product
     * product.ngoProducts.forEach(ngoProduct => {
     *   const action = ngoProduct.isOffer ? 'offers' : 'needs';
     *   console.log(`${ngoProduct.ngo.name} ${action} ${ngoProduct.quantity} units`);
     * });
     * 
     * // Find NGOs that need this product
     * const ngosNeedingProduct = product.ngoProducts
     *   .filter(np => !np.isOffer)
     *   .map(np => np.ngo);
     * 
     * // Calculate total quantity needed vs offered
     * const totalNeeded = product.ngoProducts
     *   .filter(np => !np.isOffer)
     *   .reduce((sum, np) => sum + np.quantity, 0);
     * ```
     * 
     * @relationship OneToMany with NGOProduct
     * @inverseSide 'product'
     * @lazy true  // Load on demand for performance
     */
    @OneToMany('NGOProduct', 'product')
    public ngoProducts!: NGOProduct[];

    /**
     * Constructor for creating Product instances.
     * 
     * Initializes a new Product entity with optional partial data.
     * Automatically calls parent constructor to initialize GenericEntity fields.
     * 
     * @param partial - Optional partial Product data for initialization
     * 
     * @example
     * ```typescript
     * // Create empty product
     * const product = new Product();
     * 
     * // Create product with initial data
     * const product = new Product({
     *   name: 'Novo Produto',
     *   description: 'Descrição detalhada do produto',
     *   category: 'Categoria'
     * });
     * 
     * // Create minimal product
     * const minimalProduct = new Product({
     *   name: 'Produto Básico'
     * });
     * ```
     */
    public constructor(partial?: Partial<Product>)
    {
        super();
        Object.assign(this, partial);
    }

    /**
     * Get supplier product offerings sorted by price (ascending).
     * 
     * Helper method to get supplier offerings ordered by price for
     * easy comparison and recommendation functionality.
     * 
     * @param ascending - Sort order (true for ascending, false for descending)
     * @returns Array of SupplierProduct sorted by price
     * 
     * @example
     * ```typescript
     * // Get cheapest to most expensive
     * const cheapestFirst = product.getSupplierProductsByPrice(true);
     * 
     * // Get most expensive to cheapest
     * const expensiveFirst = product.getSupplierProductsByPrice(false);
     * ```
     */
    public getSupplierProductsByPrice(ascending: boolean = true): SupplierProduct[]
    {
        return this.supplierProducts
            .sort((a, b) => ascending ? a.price - b.price : b.price - a.price);
    }

    /**
     * Calculate total available quantity from all suppliers.
     * 
     * Aggregates the available quantities across all supplier offerings
     * to determine total market availability.
     * 
     * @returns Total available quantity across all suppliers
     * 
     * @example
     * ```typescript
     * const totalAvailable = product.getTotalAvailableQuantity();
     * console.log(`Total available: ${totalAvailable} units`);
     * ```
     */
    public getTotalAvailableQuantity(): number
    {
        return this.supplierProducts
            .reduce((total, sp) => total + sp.availableQuantity, 0);
    }

    /**
     * Get the minimum price across all supplier offerings.
     * 
     * Useful for price comparison and budgeting calculations.
     * 
     * @returns Minimum price or null if no suppliers
     * 
     * @example
     * ```typescript
     * const minPrice = product.getMinimumPrice();
     * if (minPrice !== null) {
     *   console.log(`Cheapest price: R$ ${minPrice.toFixed(2)}`);
     * }
     * ```
     */
    public getMinimumPrice(): number | null
    {
        if (this.supplierProducts.length === 0) return null;
        
        const prices = this.supplierProducts.map(sp => sp.price);
        return Math.min(...prices);
    }

    /**
     * Check if product has active supplier offerings.
     * 
     * Determines if the product is currently available from any supplier
     * based on available quantities.
     * 
     * @returns True if at least one supplier has available quantity
     * 
     * @example
     * ```typescript
     * if (product.hasAvailableSuppliers()) {
     *   console.log('Product is available for purchase');
     * }
     * ```
     */
    public hasAvailableSuppliers(): boolean
    {
        return this.supplierProducts.some(sp => sp.availableQuantity > 0);
    }
}

