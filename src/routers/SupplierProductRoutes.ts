import { Router } from 'express'

import { SupplierProductController } from '../controllers/SupplierProductController'
import { authenticateUser } from '../middlewares/authenticateUser'
import { resolveSupplierAccess } from '../middlewares/resolveSupplierAccess'
import { resolveSupplierProduct } from '../middlewares/resolveSupplierProduct'
import { UserRole } from '../entities/User'

const router: Router = Router()

router.post(
  '/:uuid/products',
  authenticateUser(true, [UserRole.ADMIN, UserRole.SUPPLIER_MANAGER]),
  resolveSupplierAccess,
  SupplierProductController.create
)

router.patch(
  '/product/:uuid',
  authenticateUser(true, [UserRole.ADMIN, UserRole.SUPPLIER_MANAGER, UserRole.SUPPLIER_EMPLOYER]),
  resolveSupplierProduct,
  SupplierProductController.update
)

router.delete(
  '/product/:uuid',
  authenticateUser(true, [UserRole.ADMIN, UserRole.SUPPLIER_MANAGER]),
  resolveSupplierProduct,
  SupplierProductController.delete
)

export default router
