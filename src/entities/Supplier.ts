import {Column, Entity, JoinColumn, ManyToMany, OneToMany, OneToOne,} from 'typeorm';

import {ApprovalStatus} from './ApprovalStatus';
import {GenericEntity} from '../types/GenericEntity';

import type {SupplierPaymentReceipt} from './SupplierPaymentReceipt';
import type {SupplierProduct} from './SupplierProduct';
import type {User} from './User';

/**
 * Entity representing a Supplier organization in the SICRON ecosystem.
 * 
 * Suppliers are business entities that provide products and services to NGOs
 * within the platform. They can manage their product catalog, handle orders,
 * and maintain financial records through payment receipts. The entity implements
 * the GenericEntity pattern for secure dual-identifier management.
 * 
 * ## Key Features
 * 
 * ### Business Identity
 * - Legal company identification through CNPJ
 * - Trade name for business operations
 * - Government registration numbers (state and municipal)
 * - Complete contact and location information
 * 
 * ### Management Structure
 * - Designated manager (User entity)
 * - Employee management system
 * - Role-based access control
 * - Approval workflow for business verification
 * 
 * ### Product Catalog
 * - Comprehensive product management
 * - Supplier-specific product offerings
 * - Inventory and availability tracking
 * 
 * ### Financial Management
 * - Payment receipt tracking
 * - Transaction history
 * - Financial reporting capabilities
 * 
 * ## Approval Process
 * 
 * Suppliers must undergo verification before full platform access:
 * - **PENDING**: Initial registration awaiting verification
 * - **APPROVED**: Fully operational supplier status
 * - **REJECTED**: Registration declined or suspended
 * 
 * @example
 * ```typescript
 * // Creating a new supplier
 * const supplier = new Supplier({
 *   companyName: 'Distribuidora ABC Ltda',
 *   tradeName: 'ABC Distribuidora',
 *   cnpj: '98.765.432/0001-10',
 *   stateRegistration: '123.456.789.012',
 *   municipalRegistration: '987654321',
 *   contactEmail: 'contato@abcdistribuidora.com',
 *   phone: '+5511888777666',
 *   address: 'Av. Industrial, 123',
 *   city: 'São Paulo',
 *   state: 'SP',
 *   postalCode: '01234-567',
 *   manager: managerUser
 * });
 * 
 * await supplierRepo.createAndSave(supplier);
 * ```
 * 
 * @example
 * ```typescript
 * // Supplier with complete location information
 * const supplier = new Supplier({
 *   companyName: 'Fornecedora Nacional S.A.',
 *   tradeName: 'Fornecedora Nacional',
 *   cnpj: '11.222.333/0001-81',
 *   contactEmail: 'vendas@fornacional.com',
 *   phone: '+5511999998888',
 *   address: 'Rua dos Fornecedores, 456',
 *   city: 'Rio de Janeiro',
 *   state: 'RJ',
 *   postalCode: '20000-000',
 *   manager: salesManager,
 *   employees: [employee1, employee2, employee3]
 * });
 * ```
 * 
 * @extends GenericEntity
 * @since 1.0.0
 * @version 1.1.0
 */
@Entity('suppliers') 
export class Supplier extends GenericEntity
{
    /**
     * Official legal name of the company as registered with government authorities.
     * 
     * This is the formal, legal name used in contracts, invoices, and official
     * documentation. Must be unique across all suppliers in the system.
     * 
     * @example
     * ```typescript
     * supplier.companyName = 'Comercial de Produtos Alimentícios Ltda'
     * ```
     */
    @Column() 
    public companyName!: string;

    /**
     * User designated as the supplier manager.
     * 
     * The primary responsible person for the supplier's operations within the platform.
     * Has administrative privileges and can manage employees, products, and settings.
     * The relationship is enforced with CASCADE delete to maintain referential integrity.
     * 
     * @example
     * ```typescript
     * // Assign manager
     * supplier.manager = managerUser;
     * 
     * // Access manager information
     * console.log(supplier.manager.username); // 'supplier_admin'
     * console.log(supplier.manager.email);    // 'admin@supplier.com'
     * ```
     * 
     * @relationship OneToOne with User
     * @cascade CASCADE delete
     * @required true
     */
    @OneToOne('User', {nullable: false, onDelete: 'CASCADE'})
    @JoinColumn({
        name: 'manager_uuid',
        referencedColumnName: 'uuid',
    })
    public manager!: User;

    /**
     * Collection of users employed by this supplier.
     * 
     * Employees can perform operational tasks but have limited administrative
     * privileges compared to the manager. Supports many-to-many relationship
     * allowing users to work with multiple suppliers.
     * 
     * @example
     * ```typescript
     * // Add employees
     * supplier.employees = [employee1, employee2, employee3];
     * 
     * // Access employee information
     * supplier.employees.forEach(employee => {
     *   console.log(employee.username);
     * });
     * 
     * // Check if user is employed
     * const isEmployed = supplier.employees.some(emp => emp.uuid === user.uuid);
     * ```
     * 
     * @relationship ManyToMany with User
     * @inverseSide 'employedSuppliers'
     */
    @ManyToMany('User', 'employedSuppliers')
    public employees!: User[];

    /**
     * Commercial/operating name of the supplier.
     * 
     * This is the name used in day-to-day operations, marketing materials,
     * and public communications. May differ from the legal name for branding purposes.
     * Often shorter and more marketable than the formal company name.
     * 
     * @example
     * ```typescript
     * supplier.tradeName = 'ABC Distribuidora'  // Shorter, branded name
     * ```
     */
    @Column() 
    public tradeName!: string;

    /**
     * Brazilian National Registry of Legal Entities (CNPJ).
     * 
     * Unique 14-digit identifier assigned by the Brazilian tax authority (Receita Federal).
     * Used for legal identification, tax compliance, and business verification.
     * Format: XX.XXX.XXX/XXXX-XX (with formatting) or 14 digits (stored format).
     * 
     * @example
     * ```typescript
     * supplier.cnpj = '98.765.432/0001-10'  // Formatted
     * supplier.cnpj = '98765432000110'      // Raw 14 digits
     * ```
     * 
     * @see {@link https://www.gov.br/receitafederal/pt-br/assuntos/cadastros/cnpj} CNPJ Information
     * @maxLength 14
     * @unique true
     */
    @Column({unique: true, length: 14}) 
    public cnpj!: string;

    /**
     * State registration number for tax purposes.
     * 
     * State-level business registration number used for ICMS (state tax) calculations
     * and state-level tax compliance. Format varies by Brazilian state.
     * May be null for suppliers not required to register at state level.
     * 
     * @example
     * ```typescript
     * supplier.stateRegistration = '123.456.789.012'  // São Paulo format
     * supplier.stateRegistration = 'ISENTO'           // Tax exempt
     * ```
     * 
     * @nullable true
     */
    @Column({nullable: true}) 
    public stateRegistration!: string;

    /**
     * Municipal registration number for local tax purposes.
     * 
     * City-level business registration number used for municipal tax compliance
     * and local business licensing. Format varies by municipality.
     * May be null for suppliers not required to register at municipal level.
     * 
     * @example
     * ```typescript
     * supplier.municipalRegistration = '1234567'     // Numeric format
     * supplier.municipalRegistration = 'MUN12345'    // Alphanumeric format
     * ```
     * 
     * @nullable true
     */
    @Column({nullable: true}) 
    public municipalRegistration!: string;

    /**
     * Current approval status of the supplier.
     * 
     * Determines whether the supplier can operate within the platform and
     * conduct business transactions. New registrations start as PENDING
     * and must be verified by administrators.
     * 
     * @example
     * ```typescript
     * supplier.status = ApprovalStatus.PENDING    // Awaiting verification
     * supplier.status = ApprovalStatus.APPROVED   // Active and operational
     * supplier.status = ApprovalStatus.REJECTED   // Registration declined
     * ```
     * 
     * @enum ApprovalStatus
     * @default ApprovalStatus.PENDING
     */
    @Column({
        type: 'enum',
        enum:    ApprovalStatus,
        default: ApprovalStatus.PENDING,
    })
    public status!: ApprovalStatus;

    /**
     * Primary email address for business communications.
     * 
     * Email used for formal business communications, order notifications,
     * invoice delivery, and system notifications. Should be monitored
     * regularly for important business updates.
     * 
     * @example
     * ```typescript
     * supplier.contactEmail = 'vendas@empresa.com'
     * supplier.contactEmail = 'orders@supplier.org'
     * ```
     * 
     * @format email
     * @required true
     */
    @Column() 
    public contactEmail!: string;

    /**
     * Primary phone number for business contact.
     * 
     * Phone number for business inquiries, order coordination, and customer support.
     * May be in international, national, or local format. Supports mobile and landline numbers.
     * 
     * @example
     * ```typescript
     * supplier.phone = '+5511999887766'  // International with country code
     * supplier.phone = '11999887766'     // National format
     * supplier.phone = '(11) 99988-7766' // Formatted Brazilian format
     * ```
     * 
     * @nullable true
     */
    @Column({nullable: true}) 
    public phone!: string;

    /**
     * Physical address of the supplier's business location.
     * 
     * Complete street address including street name, number, complement,
     * and neighborhood. Used for shipping, legal notices, and business verification.
     * 
     * @example
     * ```typescript
     * supplier.address = 'Av. das Empresas, 123, Sala 45'
     * supplier.address = 'Rua dos Fornecedores, 456, Centro'
     * ```
     * 
     * @nullable true
     */
    @Column({nullable: true}) 
    public address!: string;

    /**
     * City where the supplier is located.
     * 
     * Municipality where the supplier's primary business operations are conducted.
     * Used for geographic filtering, shipping calculations, and regional business logic.
     * 
     * @example
     * ```typescript
     * supplier.city = 'São Paulo'
     * supplier.city = 'Rio de Janeiro'
     * supplier.city = 'Belo Horizonte'
     * ```
     * 
     * @nullable true
     */
    @Column({nullable: true}) 
    public city!: string;

    /**
     * Brazilian state where the supplier is located.
     * 
     * Two-letter state code (UF) indicating the supplier's primary jurisdiction.
     * Used for tax calculations, shipping zones, and regional business rules.
     * 
     * @example
     * ```typescript
     * supplier.state = 'SP'  // São Paulo
     * supplier.state = 'RJ'  // Rio de Janeiro
     * supplier.state = 'MG'  // Minas Gerais
     * ```
     * 
     * @pattern ^[A-Z]{2}$
     * @nullable true
     */
    @Column({nullable: true}) 
    public state!: string;

    /**
     * Postal/ZIP code for the supplier's location.
     * 
     * Brazilian postal code (CEP) for shipping and geographic identification.
     * Format: XXXXX-XXX (with hyphen) or XXXXXXXX (without hyphen).
     * 
     * @example
     * ```typescript
     * supplier.postalCode = '01234-567'  // Formatted
     * supplier.postalCode = '01234567'   // Raw format
     * ```
     * 
     * @pattern ^\d{5}-?\d{3}$
     * @nullable true
     */
    @Column({nullable: true}) 
    public postalCode!: string;

    /**
     * Collection of products offered by this supplier.
     * 
     * Products represent the supplier's catalog of items available for purchase
     * by NGOs. Each supplier can offer multiple products with different
     * specifications, quantities, and pricing.
     * 
     * @example
     * ```typescript
     * // Access supplier products
     * supplier.products.forEach(supplierProduct => {
     *   console.log(`${supplierProduct.product.name}: R$ ${supplierProduct.price}`);
     * });
     * 
     * // Find products by category
     * const foodProducts = supplier.products.filter(
     *   sp => sp.product.category === 'Alimentação'
     * );
     * ```
     * 
     * @relationship OneToMany with SupplierProduct
     * @inverseSide 'supplier'
     */
    @OneToMany('SupplierProduct', 'supplier')
    public products!: SupplierProduct[];

    /**
     * Collection of payment receipts issued by this supplier.
     * 
     * Financial records representing completed transactions, invoices,
     * and payment confirmations. Used for accounting, reporting, and
     * financial audit trails.
     * 
     * @example
     * ```typescript
     * // Access payment history
     * supplier.paymentReceipts.forEach(receipt => {
     *   console.log(`${receipt.date}: R$ ${receipt.amount}`);
     * });
     * 
     * // Calculate total revenue
     * const totalRevenue = supplier.paymentReceipts
     *   .reduce((sum, receipt) => sum + receipt.amount, 0);
     * ```
     * 
     * @relationship OneToMany with SupplierPaymentReceipt
     * @inverseSide 'supplier'
     */
    @OneToMany('SupplierPaymentReceipt', 'supplier')
    public paymentReceipts!: SupplierPaymentReceipt[];

    /**
     * Constructor for creating Supplier instances.
     * 
     * Initializes a new Supplier entity with optional partial data.
     * Automatically calls parent constructor to initialize GenericEntity fields.
     * 
     * @param partial - Optional partial Supplier data for initialization
     * 
     * @example
     * ```typescript
     * // Create empty supplier
     * const supplier = new Supplier();
     * 
     * // Create supplier with initial data
     * const supplier = new Supplier({
     *   companyName: 'Nova Empresa Ltda',
     *   tradeName: 'Nova Empresa',
     *   cnpj: '12.345.678/0001-90',
     *   contactEmail: 'contato@novaempresa.com'
     * });
     * ```
     */
    public constructor(partial?: Partial<Supplier>)
    {
        super();
        Object.assign(this, partial);
    }
}

