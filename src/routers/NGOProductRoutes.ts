import { Router } from 'express'

import { NGOProductController } from '../controllers/NGOProductController'
import { authenticateUser } from '../middlewares/authenticateUser'
import { resolveNGOAccess } from '../middlewares/resolveNGOAccess'
import { resolveNGOProduct } from '../middlewares/resolveNGOProduct'
import { UserRole } from '../entities/User'

const router: Router = Router()

router.post(
  '/:uuid/products',
  authenticateUser(true, [UserRole.ADMIN, UserRole.NGO_MANAGER]),
  resolveNGOAccess,
  NGOProductController.create
)

router.patch(
  '/product/:uuid',
  authenticateUser(true, [UserRole.ADMIN, UserRole.NGO_MANAGER]),
  resolveNGOProduct,
  NGOProductController.update
)

router.delete(
  '/product/:uuid',
  authenticateUser(true, [UserRole.ADMIN, UserRole.NGO_MANAGER]),
  resolveNGOProduct,
  NGOProductController.delete
)

export default router
