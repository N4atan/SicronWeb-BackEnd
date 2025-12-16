import { Router } from 'express';

import { ProductController } from '../controllers/ProductController';
import { authenticateUser } from '../middlewares/authenticateUser';
import { resolveProduct } from '../middlewares/resolveProduct';
import { UserRole } from '../entities/User';

const router: Router = Router();

router.get('/', authenticateUser(false), ProductController.query);
router.post('/', authenticateUser(true, [UserRole.ADMIN]), ProductController.create);
router.patch('/:uuid', authenticateUser(true, [UserRole.ADMIN]), resolveProduct, ProductController.update);
router.delete('/:uuid', authenticateUser(true, [UserRole.ADMIN]), resolveProduct, ProductController.delete);

export default router;
