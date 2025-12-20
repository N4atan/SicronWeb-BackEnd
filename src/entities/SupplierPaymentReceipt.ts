import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne,} from 'typeorm';

import {GenericEntity} from '../types/GenericEntity';

import type {Supplier} from './Supplier';

/**
 * Entity representing a payment receipt uploaded by a Supplier.
 * 
 * This entity tracks financial transactions made by suppliers within the
 * SICRON platform, serving as proof of payment and enabling transparent
 * financial record-keeping for business operations. The entity implements
 * the GenericEntity pattern for secure dual-identifier management.
 * 
 * ## Key Features
 * 
 * ### Financial Transaction Tracking
 * - Precise payment amount recording with decimal precision
 * - Automatic timestamp for payment date
 * - File-based receipt documentation for audit compliance
 * 
 * ### Business Relationship Management
 * - Links suppliers with their payment transactions
 * - Maintains referential integrity
 * - Supports payment history and financial reporting
 * 
 * ### Audit and Compliance
 * - Immutable payment records
 * - Timestamp tracking for financial compliance
 * - Document storage for verification purposes
 * 
 * @example
 * ```typescript
 * // Supplier uploads payment receipt
 * const paymentReceipt = new SupplierPaymentReceipt({
 *   supplier: abcSupplier,
 *   fileUrl: 'https://storage.example.com/payments/def456.pdf',
 *   amount: 2500.00,
 *   paymentDate: new Date('2024-01-20')
 * });
 * 
 * await paymentRepo.createAndSave(paymentReceipt);
 * ```
 * 
 * @example
 * ```typescript
 * // Payment tracking and reporting
 * const supplierPayments = await paymentRepo.find({
 *   where: { supplier: currentSupplier },
 *   order: { paymentDate: 'DESC' }
 * });
 * 
 * const totalPaid = supplierPayments.reduce(
 *   (sum, payment) => sum + payment.amount, 0
 * );
 * 
 * // Monthly payment summary
 * const monthlyTotal = supplierPayments
 *   .filter(payment => {
 *     const paymentMonth = payment.paymentDate.getMonth();
 *     const paymentYear = payment.paymentDate.getFullYear();
 *     return paymentMonth === currentMonth && paymentYear === currentYear;
 *   })
 *   .reduce((sum, payment) => sum + payment.amount, 0);
 * ```
 * 
 * @extends GenericEntity
 * @since 1.0.0
 * @version 1.1.0
 */
@Entity('supplier_payment_receipts')
export class SupplierPaymentReceipt extends GenericEntity
{
    /**
     * Supplier who made the payment.
     * 
     * The business entity that is responsible for this payment transaction.
     * This relationship enables payment history tracking and supplier
     * financial management.
     * 
     * @example
     * ```typescript
     * // Access supplier information
     * console.log(payment.supplier.companyName); // 'ABC Distribuidora Ltda'
     * console.log(payment.supplier.tradeName);   // 'ABC Distribuidora'
     * 
     * // Find all payments by supplier
     * const supplierPayments = await paymentRepo.find({
     *   where: { supplier: targetSupplier }
     * });
     * ```
     * 
     * @relationship ManyToOne with Supplier
     * @inverseSide 'paymentReceipts'
     * @required true
     */
    @ManyToOne('Supplier', 'paymentReceipts')
    @JoinColumn({name: 'supplier_uuid', referencedColumnName: 'uuid'})
    public supplier!: Supplier;

    /**
     * URL path to the payment receipt file.
     * 
     * Storage location of the uploaded receipt document (PDF, image, etc.)
     * that serves as proof of the payment transaction. This enables
     * verification and compliance with financial and tax regulations.
     * 
     * @example
     * ```typescript
     * // Access receipt file
     * const receiptUrl = payment.fileUrl;
     * // 'https://storage.sicron.com/payments/2024/01/550e8400-e29b-41d4-a716-446655440000.pdf'
     * 
     * // Generate download link for accounting
     * const downloadLink = `${baseUrl}${receiptUrl}`;
     * 
     * // Access receipt for verification
     * if (await verifyReceiptFile(receiptUrl)) {
     *   console.log('Payment receipt verified');
     * }
     * ```
     * 
     * @pattern ^https?:\/\/.+
     * @required true
     */
    @Column() 
    public fileUrl!: string;

    /**
     * Payment amount in Brazilian Real (BRL).
     * 
     * Financial value of the payment transaction with decimal precision
     * for accurate currency representation. Supports fractional values
     * for precise financial tracking and accounting.
     * 
     * @example
     * ```typescript
     * // Various payment amounts
     * payment.amount = 1500.00;    // R$ 1,500.00
     * payment.amount = 25000.50;   // R$ 25,000.50
     * payment.amount = 375.25;     // R$ 375.25
     * 
     * // Format for financial reports
     * const formattedAmount = new Intl.NumberFormat('pt-BR', {
     *   style: 'currency',
     *   currency: 'BRL'
     * }).format(payment.amount);
     * console.log(formattedAmount); // 'R$ 1.500,00'
     * 
     * // Calculate tax implications
     * const taxRate = 0.186; // 18.6% tax rate example
     * const taxAmount = payment.amount * taxRate;
     * const netAmount = payment.amount - taxAmount;
     * ```
     * 
     * @precision 10,2
     * @minimum 0.01
     * @currency BRL
     */
    @Column('decimal', {precision: 10, scale: 2})
    public amount!: number;

    /**
     * Date when the payment was made.
     * 
     * Timestamp indicating when the financial transaction occurred.
     * This date represents the actual payment transaction date for
     * financial reporting, accounting, and tax compliance purposes.
     * 
     * @example
     * ```typescript
     * // Access payment date
     * console.log(payment.paymentDate); // 2024-01-20T09:15:00.000Z
     * 
     * // Format for financial statements
     * const formattedDate = payment.paymentDate.toLocaleDateString('pt-BR');
     * console.log(formattedDate); // '20/01/2024'
     * 
     * // Quarterly payment reporting
     * const quarterStart = new Date('2024-01-01');
     * const quarterEnd = new Date('2024-03-31');
     * const quarterlyPayments = await paymentRepo
     *   .createQueryBuilder('payment')
     *   .where('payment.paymentDate BETWEEN :start AND :end', {
     *     start: quarterStart,
     *     end: quarterEnd
     *   })
     *   .getMany();
     * 
     * // Calculate payment aging
     * const daysSincePayment = Math.floor(
     *   (new Date().getTime() - payment.paymentDate.getTime()) / (1000 * 60 * 60 * 24)
     * );
     * console.log(`Payment is ${daysSincePayment} days old`);
     * ```
     * 
     * @type datetime
     * @autoGenerated true
     */
    @CreateDateColumn({name: 'payment_date'})
    public paymentDate!: Date;

    /**
     * Constructor for creating SupplierPaymentReceipt instances.
     * 
     * Initializes a new payment receipt entity with optional partial data.
     * Automatically calls parent constructor to initialize GenericEntity fields.
     * 
     * @param partial - Optional partial SupplierPaymentReceipt data for initialization
     * 
     * @example
     * ```typescript
     * // Create empty payment receipt
     * const payment = new SupplierPaymentReceipt();
     * 
     * // Create payment with initial data
     * const payment = new SupplierPaymentReceipt({
     *   supplier: currentSupplier,
     *   fileUrl: '/receipts/payment789.pdf',
     *   amount: 1000.00
     * });
     * 
     * // Create payment with full details
     * const detailedPayment = new SupplierPaymentReceipt({
     *   supplier: vendorSupplier,
     *   fileUrl: 'https://storage.com/receipts/payment_20240120.pdf',
     *   amount: 5000.00,
     *   paymentDate: new Date('2024-01-20T14:30:00Z')
     * });
     * ```
     */
    public constructor(partial?: Partial<SupplierPaymentReceipt>)
    {
        super();
        Object.assign(this, partial);
    }

    /**
     * Get formatted payment amount for display.
     * 
     * Helper method to format the payment amount as Brazilian currency
     * for financial reports, statements, and user interface display.
     * 
     * @returns Formatted currency string
     * 
     * @example
     * ```typescript
     * const formatted = payment.getFormattedAmount();
     * console.log(formatted); // 'R$ 2.500,00'
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
     * Check if payment is recent (within specified days).
     * 
     * Utility method to determine if the payment occurred within
     * a recent timeframe for cash flow analysis and reporting.
     * 
     * @param days - Number of days to consider as recent
     * @returns True if payment is within the specified timeframe
     * 
     * @example
     * ```typescript
     * // Check if payment is within last 7 days (current week)
     * if (payment.isRecent(7)) {
     *   console.log('Recent payment - include in cash flow');
     * }
     * 
     * // Check if payment is within last 90 days (quarter)
     * if (payment.isRecent(90)) {
     *   console.log('Quarterly payment - include in QTD report');
     * }
     * ```
     */
    public isRecent(days: number = 30): boolean
    {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        return this.paymentDate >= cutoffDate;
    }

    /**
     * Get payment age in days.
     * 
     * Calculates the number of days since the payment was made
     * for aging analysis, cash flow management, and financial reporting.
     * 
     * @returns Number of days since payment
     * 
     * @example
     * ```typescript
     * const ageInDays = payment.getAgeInDays();
     * console.log(`Payment is ${ageInDays} days old`);
     * 
     * // Categorize payment by age
     * if (ageInDays <= 30) {
     *   console.log('Current payment');
     * } else if (ageInDays <= 60) {
     *   console.log('30-day payment');
     * } else if (ageInDays <= 90) {
     *   console.log('60-day payment');
     * } else {
     *   console.log('Overdue payment');
     * }
     * ```
     */
    public getAgeInDays(): number
    {
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - this.paymentDate.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    /**
     * Get payment period (month/year) for grouping.
     * 
     * Extracts the payment period in YYYY-MM format for financial
     * reporting and period-based analysis.
     * 
     * @returns Payment period string in YYYY-MM format
     * 
     * @example
     * ```typescript
     * const period = payment.getPaymentPeriod();
     * console.log(period); // '2024-01'
     * 
     * // Group payments by period
     * const paymentsByPeriod = payments.reduce((acc, payment) => {
     *   const period = payment.getPaymentPeriod();
     *   if (!acc[period]) acc[period] = [];
     *   acc[period].push(payment);
     *   return acc;
     * }, {});
     * ```
     */
    public getPaymentPeriod(): string
    {
        return `${this.paymentDate.getFullYear()}-${String(this.paymentDate.getMonth() + 1).padStart(2, '0')}`;
    }
}

