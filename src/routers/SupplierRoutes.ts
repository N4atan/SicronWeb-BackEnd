import { Router } from 'express'

import { SupplierController } from '../controllers/SupplierController'
import { authenticateUser } from '../middlewares/authenticateUser'
import { resolveSupplierAccess } from '../middlewares/resolveSupplierAccess'
import { UserRole } from '../entities/User'

const router: Router = Router()

router.get('/', authenticateUser(false), SupplierController.query)

router.post('/', authenticateUser(true), SupplierController.register)

router.patch('/:uuid', authenticateUser(true, [UserRole.ADMIN, UserRole.SUPPLIER_MANAGER]), resolveSupplierAccess, SupplierController.update)

router.delete('/:uuid', authenticateUser(true, [UserRole.ADMIN, UserRole.SUPPLIER_MANAGER]), resolveSupplierAccess, SupplierController.delete)

router.post('/:uuid/employees', authenticateUser(true, [UserRole.SUPPLIER_ADMIN]), resolveSupplierAccess, SupplierController.addEmployee)

export default router
