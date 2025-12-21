import {Router} from 'express';

import NGOProductRoutes from './NGOProductRoutes';
import NGORoutes from './NGORoutes';
import ProductRoutes from './ProductRoutes';
import SupplierPaymentRoutes from './SupplierPaymentRoutes';
import SupplierProductRoutes from './SupplierProductRoutes';
import SupplierRoutes from './SupplierRoutes';
import UserDonationRoutes from './UserDonationRoutes';
import UserRoutes from './UserRoutes';

import { reassureRefreshServiceInitialization } from '../middlewares/reassureRefreshServiceInitialization';

const router: Router = Router();

router.use(reassureRefreshServiceInitialization);

/**
 * Main Router linking all sub-routers.
 */
router.use('/users', UserRoutes);
router.use('/ngos', NGORoutes);
router.use('/suppliers', SupplierRoutes);
router.use('/products', ProductRoutes);
router.use('/supplier-products', SupplierProductRoutes);
router.use('/ngo-products', NGOProductRoutes);
router.use('/donations', UserDonationRoutes);
router.use('/payments', SupplierPaymentRoutes);

export default router;
