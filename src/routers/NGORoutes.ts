import { Router } from "express";
import { NGOController } from "../controllers/NGOController";

import { UserRole } from "../entities/User";

import { authenticateUser } from "../middlewares/authenticateUser";
import { resolveNGOAccess } from "../middlewares/resolveNGOAccess";

let router: Router = Router();

router.get("/", authenticateUser(false), NGOController.query);

router.post("/", authenticateUser(true), NGOController.register);

router.patch("/:uuid", authenticateUser(true, [UserRole.NGO_MANAGER, UserRole.ADMIN, UserRole.NGO_EMPLOYER]), resolveNGOAccess, NGOController.update);
router.delete("/:uuid", authenticateUser(true, [UserRole.NGO_MANAGER, UserRole.ADMIN]), resolveNGOAccess, NGOController.delete);

router.post('/:uuid/employees', authenticateUser(true, [UserRole.NGO_MANAGER]), resolveNGOAccess, NGOController.addEmployee);
router.delete('/:uuid/employees', authenticateUser(true, [UserRole.NGO_MANAGER, UserRole.ADMIN]), resolveNGOAccess, NGOController.removeEmployee);
router.post('/:uuid/block', authenticateUser(true), resolveNGOAccess, NGOController.blockEmployee);

export default router;
