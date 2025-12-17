/**
 * Express module declaration to extend the global Request interface.
 * Adds custom properties for authenticated users and resolved
 * entities.
 */
export {};

declare global
{
    namespace Express {
        /**
         * Extended Express Request interface with custom properties.
         */
        interface Request
        {
            /** Authenticated User entity */
            user?: import('../../entities/User').User|null;

            /**
             * Target User entity for operations affecting another
             * user
             */
            target?: import('../../entities/User').User|null;

            /** Resolved NGO entity */
            ngo?: import('../../entities/NGO').NGO|null;

            /** Resolved Supplier entity */
            supplier?:
                import('../../entities/Supplier').Supplier|null;

            /** Resolved Product entity */
            product?: import('../../entities/Product').Product|null;

            /** Resolved SupplierProduct entity */
            supplierProduct?:|import('../../entities/SupplierProduct')
                .SupplierProduct|null;

            /** Resolved NGOProduct entity */
            ngoProduct?:
                import('../../entities/NGOProduct').NGOProduct|null;

            /** Resolved Supplier Payment Receipt */
            paymentReceipt:|
                import('../entities/SupplierPaymentReceipt')
                    .SupplierPaymentReceipt|null;

            /** Resolved User Donation Receipt */
            donationReceipt:|import('../entities/UserDonationReceipt')
                .UserDonationReceipt|null;

            /** Flag indicating if the user is logged in */
            logged?: boolean;
        }
    }
}
