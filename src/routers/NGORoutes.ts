import {Router} from 'express';

import {NGOController} from '../controllers/NGOController';
import {UserRole} from '../entities/User';
import {authenticateUser} from '../middlewares/authenticateUser';
import {cacheMiddleware} from '../middlewares/cacheMiddleware';
import {resolveNGOAccess} from '../middlewares/resolveNGOAccess';

const router: Router = Router();

/**
 * Routes for NGO Entity operations.
 * Base Path: /api/ngos
 */

// Queries
router.get(
    '/',
    authenticateUser(false),
    cacheMiddleware(60),
    NGOController.query,
);

// Registration
router.post('/', authenticateUser(true), NGOController.register);

// Management (Protected)
router.patch(
    '/:uuid',
    authenticateUser(
        true,
        [
            UserRole.NGO_MANAGER,
            UserRole.ADMIN,
            UserRole.NGO_EMPLOYER,
        ]),
    resolveNGOAccess,
    NGOController.update,
);
router.delete(
    '/:uuid',
    authenticateUser(true, [UserRole.NGO_MANAGER, UserRole.ADMIN]),
    resolveNGOAccess,
    NGOController.delete,
);

// Employee Management
router.post(
    '/:uuid/employees',
    authenticateUser(true, [UserRole.NGO_MANAGER]),
    resolveNGOAccess,
    NGOController.addEmployee,
);
router.delete(
    '/:uuid/employees',
    authenticateUser(true, [UserRole.NGO_MANAGER, UserRole.ADMIN]),
    resolveNGOAccess,
    NGOController.removeEmployee,
);
router.post(
    '/:uuid/block',
    authenticateUser(true),
    resolveNGOAccess,
    NGOController.blockEmployee,
);

export default router;
