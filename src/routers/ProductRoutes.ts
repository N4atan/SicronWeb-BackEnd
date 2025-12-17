import {Router} from 'express';

import {ProductController} from '../controllers/ProductController';
import {UserRole} from '../entities/User';
import {authenticateUser} from '../middlewares/authenticateUser';
import {cacheMiddleware} from '../middlewares/cacheMiddleware';
import {resolveProduct} from '../middlewares/resolveProduct';

const router: Router = Router();

/**
 * Routes for Global Product Catalog operations.
 * Base Path: /api/products
 */

router.get(
    '/',
    authenticateUser(false),
    cacheMiddleware(300),
    ProductController.query,
);
router.post(
    '/',
    authenticateUser(true, [UserRole.ADMIN]),
    ProductController.create,
);
router.patch(
    '/:uuid',
    authenticateUser(true, [UserRole.ADMIN]),
    resolveProduct,
    ProductController.update,
);
router.delete(
    '/:uuid',
    authenticateUser(true, [UserRole.ADMIN]),
    resolveProduct,
    ProductController.delete,
);

export default router;
