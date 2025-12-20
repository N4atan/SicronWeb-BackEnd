import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne,} from 'typeorm';

import {GenericEntity} from '../types/GenericEntity';

import type {NGO} from './NGO';
import type {User} from './User';

/**
 * Entity representing a donation receipt uploaded by a User to an NGO.
 * 
 * This entity tracks financial donations made by users to NGOs within the
 * SICRON platform. It serves as proof of donation and enables transparent
 * financial tracking between donors and recipient organizations. The entity
 * implements the GenericEntity pattern for secure dual-identifier management.
 * 
 * ## Key Features
 * 
 * ### Financial Tracking
 * - Precise donation amount recording with decimal precision
 * - Automatic timestamp for donation date
 * - File-based receipt documentation
 * 
 * ### Relationship Management
 * - Links donors (Users) with recipient NGOs
 * - Maintains referential integrity
 * - Supports donation history and reporting
 * 
 * ### Audit Trail
 * - Immutable donation records
 * - Timestamp tracking for compliance
 * - File storage for receipt verification
 * 
 * @example
 * ```typescript
 * // User donates to NGO with receipt upload
 * const donation = new UserDonationReceipt({
 *   user: donorUser,
 *   ngo: recipientNGO,
 *   fileUrl: 'https://storage.example.com/receipts/abc123.pdf',
 *   amount: 500.00,
 *   donationDate: new Date('2024-01-15')
 * });
 * 
 * await donationRepo.createAndSave(donation);
 * ```
 * 
 * @example
 * ```typescript
 * // Donation tracking and reporting
 * const userDonations = await donationRepo.find({
 *   where: { user: currentUser },
 *   relations: ['ngo', 'ngo.name'],
 *   order: { donationDate: 'DESC' }
 * });
 * 
 * const totalDonated = userDonations.reduce(
 *   (sum, donation) => sum + donation.amount, 0
 * );
 * ```
 * 
 * @extends GenericEntity
 * @since 1.0.0
 * @version 1.1.0
 */
@Entity('user_donation_receipts') 
export class UserDonationReceipt extends GenericEntity
{
    /**
     * User who made the donation.
     * 
     * The donor entity representing the person or organization making
     * the financial contribution to the NGO. This relationship enables
     * donation history tracking and donor recognition.
     * 
     * @example
     * ```typescript
     * // Access donor information
     * console.log(donation.user.username); // 'generous_donor'
     * console.log(donation.user.email);    // 'donor@example.com'
     * 
     * // Find all donations by user
     * const userDonations = await donationRepo.find({
     *   where: { user: currentUser }
     * });
     * ```
     * 
     * @relationship ManyToOne with User
     * @required true
     */
    @ManyToOne('User')
    @JoinColumn({name: 'user_id'})
    public user!: User;

    /**
     * NGO that received the donation.
     * 
     * The recipient organization that benefits from this donation.
     * This relationship enables donation tracking from donor to recipient
     * and supports impact reporting and transparency.
     * 
     * @example
     * ```typescript
     * // Access recipient NGO information
     * console.log(donation.ngo.name);      // 'Fundação Esperança'
     * console.log(donation.ngo.area);      // 'Educação'
     * 
     * // Find all donations received by NGO
     * const ngoDonations = await donationRepo.find({
     *   where: { ngo: targetNGO }
     * });
     * ```
     * 
     * @relationship ManyToOne with NGO
     * @required true
     */
    @ManyToOne('NGO')
    @JoinColumn({name: 'ngo_id'})
    public ngo!: NGO;

    /**
     * URL path to the donation receipt file.
     * 
     * Storage location of the uploaded receipt document (PDF, image, etc.)
     * that serves as proof of the donation. This enables verification
     * and compliance with financial regulations.
     * 
     * @example
     * ```typescript
     * // Access receipt file
     * const receiptUrl = donation.fileUrl;
     * // 'https://storage.sicron.com/receipts/2024/01/550e8400-e29b-41d4-a716-446655440000.pdf'
     * 
     * // Generate download link
     * const downloadLink = `${baseUrl}${receiptUrl}`;
     * ```
     * 
     * @pattern ^https?:\/\/.+
     * @required true
     */
    @Column() 
    public fileUrl!: string;

    /**
     * Donation amount in Brazilian Real (BRL).
     * 
     * Financial value of the donation with decimal precision for accurate
     * currency representation. Supports fractional values for precise
     * donation tracking and reporting.
     * 
     * @example
     * ```typescript
     * // Various donation amounts
     * donation.amount = 100.00;     // R$ 100.00
     * donation.amount = 1500.50;    // R$ 1,500.50
     * donation.amount = 25.75;      // R$ 25.75
     * 
     * // Format for display
     * const formattedAmount = new Intl.NumberFormat('pt-BR', {
     *   style: 'currency',
     *   currency: 'BRL'
     * }).format(donation.amount);
     * console.log(formattedAmount); // 'R$ 100,00'
     * ```
     * 
     * @precision 10,2
     * @minimum 0.01
     * @currency BRL
     */
    @Column('decimal', {precision: 10, scale: 2})
    public amount!: number;

    /**
     * Date when the donation was made.
     * 
     * Timestamp indicating when the financial contribution occurred.
     * This date may differ from the upload date and represents the
     * actual donation transaction date for financial reporting.
     * 
     * @example
     * ```typescript
     * // Access donation date
     * console.log(donation.donationDate); // 2024-01-15T14:30:00.000Z
     * 
     * // Format for display
     * const formattedDate = donation.donationDate.toLocaleDateString('pt-BR');
     * console.log(formattedDate); // '15/01/2024'
     * 
     * // Monthly donation reporting
     * const monthStart = new Date('2024-01-01');
     * const monthEnd = new Date('2024-01-31');
     * const monthlyDonations = await donationRepo
     *   .createQueryBuilder('donation')
     *   .where('donation.donationDate BETWEEN :start AND :end', {
     *     start: monthStart,
     *     end: monthEnd
     *   })
     *   .getMany();
     * ```
     * 
     * @type datetime
     * @autoGenerated true
     */
    @CreateDateColumn({name: 'donation_date'})
    public donationDate!: Date;

    /**
     * Constructor for creating UserDonationReceipt instances.
     * 
     * Initializes a new donation receipt entity with optional partial data.
     * Automatically calls parent constructor to initialize GenericEntity fields.
     * 
     * @param partial - Optional partial UserDonationReceipt data for initialization
     * 
     * @example
     * ```typescript
     * // Create empty donation receipt
     * const donation = new UserDonationReceipt();
     * 
     * // Create donation with initial data
     * const donation = new UserDonationReceipt({
     *   user: currentUser,
     *   ngo: selectedNGO,
     *   fileUrl: '/receipts/donation123.pdf',
     *   amount: 250.00
     * });
     * ```
     */
    public constructor(partial?: Partial<UserDonationReceipt>)
    {
        super();
        Object.assign(this, partial);
    }

    /**
     * Get formatted donation amount for display.
     * 
     * Helper method to format the donation amount as Brazilian currency
     * for user interface display and reporting.
     * 
     * @returns Formatted currency string
     * 
     * @example
     * ```typescript
     * const formatted = donation.getFormattedAmount();
     * console.log(formatted); // 'R$ 500,00'
     * ```
     */
    public getFormattedAmount(): string
    {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(this.amount);
    }

    /**
     * Check if donation is recent (within specified days).
     * 
     * Utility method to determine if the donation occurred within
     * a recent timeframe for filtering and notifications.
     * 
     * @param days - Number of days to consider as recent
     * @returns True if donation is within the specified timeframe
     * 
     * @example
     * ```typescript
     * // Check if donation is within last 30 days
     * if (donation.isRecent(30)) {
     *   console.log('Recent donation');
     * }
     * ```
     */
    public isRecent(days: number = 30): boolean
    {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        return this.donationDate >= cutoffDate;
    }

    /**
     * Get donation age in days.
     * 
     * Calculates the number of days since the donation was made
     * for reporting and analytics purposes.
     * 
     * @returns Number of days since donation
     * 
     * @example
     * ```typescript
     * const ageInDays = donation.getAgeInDays();
     * console.log(`Donation is ${ageInDays} days old`);
     * ```
     */
    public getAgeInDays(): number
    {
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - this.donationDate.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
}

