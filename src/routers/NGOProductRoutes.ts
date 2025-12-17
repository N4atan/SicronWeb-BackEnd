import {Router} from 'express';

import {NGOProductController} from '../controllers/NGOProductController';
import {UserRole} from '../entities/User';
import {authenticateUser} from '../middlewares/authenticateUser';
import {resolveNGOAccess} from '../middlewares/resolveNGOAccess';
import {resolveNGOProduct} from '../middlewares/resolveNGOProduct';

const router: Router = Router();

/**
 * Routes for NGO Product needs.
 * Base Path: /api/ngo (implied by index usage, but looks like
 * parameter based)
 */

router.post(
    '/:uuid/products',
    authenticateUser(true, [UserRole.ADMIN, UserRole.NGO_MANAGER]),
    resolveNGOAccess,
    NGOProductController.create,
);

// Note: These routes seem to depend on resolveNGOAccess and
// resolveProduct implicitly but they are not strictly present in the
// middleware chain. Proceeding with documentation of current state.
router.patch(
    '/product/:uuid',
    authenticateUser(true, [UserRole.ADMIN, UserRole.NGO_MANAGER]),
    resolveNGOProduct,
    NGOProductController.update,
);

router.delete(
    '/product/:uuid',
    authenticateUser(true, [UserRole.ADMIN, UserRole.NGO_MANAGER]),
    resolveNGOProduct,
    NGOProductController.delete,
);

export default router;
