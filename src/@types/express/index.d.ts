export {}; // <--- ADICIONA ISTO PARA TORNAR O FICHEIRO UM MÓDULO

declare global {
    namespace Express {
      interface Request {
        user?: import("../../entities/User").User | null;
        target?: import("../../entities/User").User | null;
        ngo?: import("../../entities/NGO").NGO | null;
	supplier?: import ("../../entities/Supplier").Supplier | null;
	product?: import ("../../entities/Product").Product | null;
	supplierProduct?: import ("../../entities/SupplierProduct").SupplierProduct | null;
	ngoProduct?: import ("../../entities/NGOProduct").NGOProduct | null;

	paymentReceipt: import ("../entities/SupplierPaymentReceipt").SupplierPaymentReceipt | null;
	donationReceipt: import ("../entities/UserDonationReceipt").UserDonationReceipt | null;

        logged?: boolean;
      }
    }
}
