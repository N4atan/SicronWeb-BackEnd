import { Router } from 'express';


import UserRoutes from './UserRoutes';
import NGORoutes from './NGORoutes';
import SupplierRoutes from './SupplierRoutes';
import ProductRoutes from './ProductRoutes';
import SupplierProductRoutes from './SupplierProductRoutes';
import NGOProductRoutes from './NGOProductRoutes';
import UserDonationRoutes from './UserDonationRoutes';
import SupplierPaymentRoutes from './SupplierPaymentRoutes';

const router: Router = Router();

router.use('/users', UserRoutes);
router.use('/ngos', NGORoutes);
router.use('/suppliers', SupplierRoutes);
router.use('/products', ProductRoutes);
router.use('/supplier-products', SupplierProductRoutes);
router.use('/ngo-products', NGOProductRoutes);
router.use('/donations', UserDonationRoutes);
router.use('/payments', SupplierPaymentRoutes);

export default router;
