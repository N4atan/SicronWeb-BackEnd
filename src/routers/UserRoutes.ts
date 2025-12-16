import { Router } from "express";

import { UserController } from "../controllers/UserController";

import { authenticateUser     } from "../middlewares/authenticateUser";
import { authorizeSelfOrAdmin } from "../middlewares/authorizeSelfOrAdmin";

let router: Router = Router();

router.get("/", authenticateUser(false), UserController.query);
router.post("/", authenticateUser(false), UserController.register);
router.post("/auth/login", authenticateUser(false), UserController.login);

router.post("/auth/refresh", authenticateUser(true), UserController.refresh);
router.post("/auth/check", authenticateUser(true), UserController.isLogged);
router.post("/auth/logout", authenticateUser(true), UserController.logout);

router.delete("/:uuid", authenticateUser(true), authorizeSelfOrAdmin, UserController.delete);
router.patch("/:uuid", authenticateUser(true), authorizeSelfOrAdmin, UserController.update);

export default router;
