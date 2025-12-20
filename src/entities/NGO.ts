import {Column, Entity, JoinColumn, ManyToMany, OneToMany, OneToOne,} from 'typeorm';

import {ApprovalStatus} from './ApprovalStatus';
import {GenericEntity} from '../types/GenericEntity';

import {NGOProduct} from './NGOProduct';
import type {User} from './User';

/**
 * Entity representing a Non-Governmental Organization (NGO) in the SICRON ecosystem.
 * 
 * NGOs are registered organizations that work towards social causes and can
 * manage products, employ staff, and interact with suppliers within the platform.
 * The entity implements the GenericEntity pattern for secure dual-identifier management.
 * 
 * ## Key Features
 * 
 * ### Organizational Identity
 * - Unique legal identification through CNPJ (Brazilian tax ID)
 * - Trade name for business operations
 * - Contact information and geographic location
 * - Organizational area of expertise
 * 
 * ### Financial Management
 * - Integrated wallet system for financial transactions
 * - Decimal precision for accurate financial calculations
 * - Transaction history and audit trail
 * 
 * ### Management Structure
 * - Dedicated manager (User entity)
 * - Employee management system
 * - Role-based access control
 * - Approval workflow for organizational status
 * 
 * ### Product Management
 * - Association with NGOProduct entities
 * - Product catalog management
 * - Inventory tracking capabilities
 * 
 * ## Approval Workflow
 * 
 * NGOs must go through an approval process before becoming active:
 * - **PENDING**: Initial registration status
 * - **APPROVED**: Fully operational status
 * - **REJECTED**: Registration declined
 * 
 * @example
 * ```typescript
 * // Creating a new NGO
 * const ngo = new NGO({
 *   name: 'Fundação Esperança',
 *   cnpj: '12.345.678/0001-90',
 *   trade_name: 'Fundação Esperança',
 *   area: 'Educação',
 *   description: 'Organização dedicada à educação infantil',
 *   local: 'São Paulo, SP',
 *   phone_number: '+5511999999999',
 *   contact_email: 'contato@esperanca.org',
 *   manager: managerUser
 * });
 * 
 * await ngoRepo.createAndSave(ngo);
 * ```
 * 
 * @example
 * ```typescript
 * // NGO with employee management
 * const ngoWithEmployees = new NGO({
 *   name: 'ONG Crescer',
 *   area: 'Desenvolvimento Comunitário',
 *   employees: [employee1, employee2, employee3],
 *   products: [product1, product2]
 * });
 * ```
 * 
 * @extends GenericEntity
 * @since 1.0.0
 * @version 1.1.0
 * @see {@link https://www.planalto.gov.br/ccivil_03/leis/leis_2001/l10171.htm} Brazilian NGO Legislation
 */
@Entity('ngotbl') 
export class NGO extends GenericEntity
{
    /**
     * Official name of the NGO as registered in legal documents.
     * 
     * This is the formal, legal name used in contracts, official communications,
     * and government registrations. Must be unique across all NGOs in the system.
     * 
     * @example
     * ```typescript
     * ngo.name = 'Instituto Brasileiro de Conservação Ambiental'
     * ```
     */
    @Column({unique: true}) 
    public name!: string;

    /**
     * Brazilian National Registry of Legal Entities (CNPJ).
     * 
     * Unique 14-digit identifier assigned by the Brazilian tax authority (Receita Federal).
     * Used for legal identification and tax compliance. Format: XX.XXX.XXX/XXXX-XX
     * 
     * @example
     * ```typescript
     * ngo.cnpj = '12.345.678/0001-90'
     * ```
     * 
     * @see {@link https://www.gov.br/receitafederal/pt-br/assuntos/cadastros/cnpj} CNPJ Information
     */
    @Column({unique: true}) 
    public cnpj!: string;

    /**
     * Commercial/operating name of the NGO.
     * 
     * This is the name used in day-to-day operations, marketing materials,
     * and public communications. May differ from the legal name for branding purposes.
     * 
     * @example
     * ```typescript
     * ngo.trade_name = 'IBCA'  // Shorter, more marketable name
     * ```
     */
    @Column({unique: true}) 
    public trade_name!: string;

    /**
     * Primary area of focus or expertise for the NGO.
     * 
     * Categorizes the NGO's main activities and areas of operation.
     * Common values include: Educação, Saúde, Meio Ambiente, Direitos Humanos, etc.
     * 
     * @example
     * ```typescript
     * ngo.area = 'Educação Infantil'  // Child education
     * ngo.area = 'Preservação Ambiental'  // Environmental conservation
     * ngo.area = 'Assistência Social'  // Social assistance
     * ```
     */
    @Column() 
    public area!: string;

    /**
     * Detailed description of the NGO's mission, activities, and impact.
     * 
     * Comprehensive text describing the organization's purpose, history,
     * current projects, and expected outcomes. Used for public profile display.
     * 
     * @example
     * ```typescript
     * ngo.description = 'Fundação dedicada a proporcionar educação 
     * de qualidade para crianças em situação de vulnerabilidade social 
     * na região metropolitana de São Paulo.'
     * ```
     */
    @Column() 
    public description!: string;

    /**
     * Financial wallet balance for the NGO.
     * 
     * Decimal value representing the current financial balance available
     * for NGO operations, donations, and transactions within the platform.
     * Precision: 10 digits total, 2 decimal places.
     * 
     * @example
     * ```typescript
     * ngo.wallet = 15000.75  // R$ 15,000.75
     * ```
     * 
     * @precision 10,2
     * @minimum 0
     */
    @Column({type: 'decimal', precision: 10, scale: 2, default: 0})
    public wallet!: number;

    /**
     * Geographic location of the NGO's main operations.
     * 
     * Physical address or general location where the NGO operates.
     * Format: City, State or full address depending on privacy requirements.
     * 
     * @example
     * ```typescript
     * ngo.local = 'São Paulo, SP'
     * ngo.local = 'Rua das Flores, 123, Centro, Rio de Janeiro, RJ'
     * ```
     */
    @Column({length: 100}) 
    public local!: string;

    /**
     * Primary phone number for contact purposes.
     * 
     * International or national format phone number for general inquiries,
     * support, and coordination. Maximum 15 characters to accommodate
     * international formats including country codes.
     * 
     * @example
     * ```typescript
     * ngo.phone_number = '+5511999887766'  // International format
     * ngo.phone_number = '11999887766'     // National format
     * ```
     * 
     * @maxLength 15
     */
    @Column({length: 15}) 
    public phone_number!: string;

    /**
     * Primary email address for official communications.
     * 
     * Email used for formal communications, legal notifications,
     * partnership inquiries, and system notifications.
     * 
     * @example
     * ```typescript
     * ngo.contact_email = 'admin@ngo.org'
     * ngo.contact_email = 'contato@fundacao.org.br'
     * ```
     * 
     * @format email
     * @maxLength 100
     */
    @Column({length: 100}) 
    public contact_email!: string;

    /**
     * Timestamp of NGO registration and creation in the system.
     * 
     * Automatically set when the entity is first persisted to the database.
     * Used for audit trails, chronological sorting, and regulatory compliance.
     * 
     * @example
     * ```typescript
     * console.log(ngo.creation_date); // 2024-01-15T10:30:00.000Z
     * ```
     * 
     * @autoGenerated
     * @type datetime
     * @default CURRENT_TIMESTAMP
     */
    @Column({type: 'datetime', default: () => 'CURRENT_TIMESTAMP'})
    public creation_date!: Date;

    /**
     * Current approval status of the NGO.
     * 
     * Determines whether the NGO can operate within the platform.
     * New registrations start as PENDING and must be approved by administrators.
     * 
     * @example
     * ```typescript
     * ngo.status = ApprovalStatus.PENDING    // Awaiting review
     * ngo.status = ApprovalStatus.APPROVED   // Active and operational
     * ngo.status = ApprovalStatus.REJECTED   // Registration declined
     * ```
     * 
     * @enum ApprovalStatus
     * @default ApprovalStatus.PENDING
     */
    @Column({
        type: 'enum',
        enum: ApprovalStatus,
        default: ApprovalStatus.PENDING,
    })
    public status!: ApprovalStatus;

    /**
     * User designated as the NGO manager.
     * 
     * The primary responsible person for the NGO's operations within the platform.
     * Has administrative privileges and can manage employees, products, and settings.
     * The relationship is enforced with CASCADE delete to maintain referential integrity.
     * 
     * @example
     * ```typescript
     * // Assign manager
     * ngo.manager = managerUser;
     * 
     * // Access manager information
     * console.log(ngo.manager.username); // 'ngo_admin'
     * console.log(ngo.manager.email);    // 'admin@ngo.org'
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
     * Collection of users employed by this NGO.
     * 
     * Employees can perform operational tasks but have limited administrative
     * privileges compared to the manager. Supports many-to-many relationship
     * allowing users to work with multiple NGOs.
     * 
     * @example
     * ```typescript
     * // Add employees
     * ngo.employees = [employee1, employee2, employee3];
     * 
     * // Access employee information
     * ngo.employees.forEach(employee => {
     *   console.log(employee.username);
     * });
     * 
     * // Check if user is employed
     * const isEmployed = ngo.employees.some(emp => emp.uuid === user.uuid);
     * ```
     * 
     * @relationship ManyToMany with User
     * @inverseSide 'employedNGOs'
     */
    @ManyToMany('User', 'employedNGOs')
    public employees!: User[];

    /**
     * Collection of products managed by this NGO.
     * 
     * Products represent items that the NGO needs, offers, or manages
     * within the platform. Each NGO can manage multiple products across
     * different categories and quantities.
     * 
     * @example
     * ```typescript
     * // Access NGO products
     * ngo.products.forEach(product => {
     *   console.log(`${product.product.name}: ${product.quantity} units`);
     * });
     * 
     * // Find specific product
     * const neededBooks = ngo.products.find(
     *   p => p.product.category === 'Livros'
     * );
     * ```
     * 
     * @relationship OneToMany with NGOProduct
     * @inverseSide 'ngo'
     */
    @OneToMany('NGOProduct', 'ngo')
    public products!: NGOProduct[];

    /**
     * Constructor for creating NGO instances.
     * 
     * Initializes a new NGO entity with optional partial data.
     * Automatically calls parent constructor to initialize GenericEntity fields.
     * 
     * @param partial - Optional partial NGO data for initialization
     * 
     * @example
     * ```typescript
     * // Create empty NGO
     * const ngo = new NGO();
     * 
     * // Create NGO with initial data
     * const ngo = new NGO({
     *   name: 'Nova ONG',
     *   area: 'Saúde',
     *   description: 'Organização de saúde comunitária'
     * });
     * ```
     */
    public constructor(partial?: Partial<NGO>)
    {
        super();
        Object.assign(this, partial);
    }
}

