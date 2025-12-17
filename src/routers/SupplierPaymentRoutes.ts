import {Router} from 'express';

import {SupplierPaymentReceiptController} from '../controllers/SupplierPaymentReceiptController';
import {authenticateUser} from '../middlewares/authenticateUser';
import {resolveSupplierPaymentAccess} from '../middlewares/resolveSupplierPaymentAccess';
import {resolveSupplierPaymentReceipt} from '../middlewares/resolveSupplierPaymentReceipt';

const router: Router = Router();

/**
 * Routes for Supplier Payment Receipts.
 * Base Path: /api/supplier-payments
 */

router.get(
    '/',
    authenticateUser(true),
    SupplierPaymentReceiptController.query);
router.post(
    '/',
    authenticateUser(true),
    SupplierPaymentReceiptController.create,
);

router.get(
    '/:uuid',
    authenticateUser(true),
    resolveSupplierPaymentReceipt,
    resolveSupplierPaymentAccess,
    (req, res) => res.status(200).json(req.paymentReceipt),
);

export default router;
