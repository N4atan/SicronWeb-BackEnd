import {Router} from 'express';

import {SupplierController} from '../controllers/SupplierController';
import {UserRole} from '../entities/User';
import {authenticateUser} from '../middlewares/authenticateUser';
import {cacheMiddleware} from '../middlewares/cacheMiddleware';
import {resolveSupplierAccess} from '../middlewares/resolveSupplierAccess';

const router: Router = Router();

/**
 * Routes for Supplier Entity operations.
 * Base Path: /api/suppliers
 */

router.get(
    '/',
    authenticateUser(false),
    cacheMiddleware(60),
    SupplierController.query,
);

router.post('/', authenticateUser(true), SupplierController.register);

router.patch(
    '/:uuid',
    authenticateUser(
        true, [UserRole.ADMIN, UserRole.SUPPLIER_MANAGER]),
    resolveSupplierAccess,
    SupplierController.update,
);

router.delete(
    '/:uuid',
    authenticateUser(
        true, [UserRole.ADMIN, UserRole.SUPPLIER_MANAGER]),
    resolveSupplierAccess,
    SupplierController.delete,
);

router.post(
    '/:uuid/employees',
    authenticateUser(true, [UserRole.SUPPLIER_MANAGER]),
    resolveSupplierAccess,
    SupplierController.addEmployee,
);
router.delete(
    '/:uuid/employees',
    authenticateUser(
        true, [UserRole.ADMIN, UserRole.SUPPLIER_MANAGER]),
    resolveSupplierAccess,
    SupplierController.removeEmployee,
);
router.post(
    '/:uuid/block',
    authenticateUser(true),
    resolveSupplierAccess,
    SupplierController.blockEmployee,
);

export default router;
