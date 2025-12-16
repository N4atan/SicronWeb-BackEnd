import { Router } from 'express'

import { SupplierPaymentReceiptController } from '../controllers/SupplierPaymentReceiptController'
import { authenticateUser } from '../middlewares/authenticateUser'
import { resolveSupplierPaymentReceipt } from '../middlewares/resolveSupplierPaymentReceipt'
import { resolveSupplierPaymentAccess } from '../middlewares/resolveSupplierPaymentAccess'

const router: Router = Router()

router.get('/', authenticateUser(true), SupplierPaymentReceiptController.query)
router.post('/', authenticateUser(true), SupplierPaymentReceiptController.create)

router.get(
  '/:uuid',
  authenticateUser(true),
  resolveSupplierPaymentReceipt,
  resolveSupplierPaymentAccess,
  (req, res) => res.status(200).json(req.paymentReceipt)
)

export default router
