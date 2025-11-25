import { Router } from "express";

import { UserController } from "../controllers/UserController";

import { loginChecker    } from "../middlewares/loginChecker";
import { loginRequire    } from "../middlewares/loginRequire";
import { loginPrivillege } from "../middlewares/loginPrivillege";

let router: Router = Router();

router.use(loginChecker);

router.get("/",            UserController.query);
router.post("/",           UserController.register);
router.post("/auth/login", UserController.login);

router.use(loginRequire);

router.post("/auth/refresh",  UserController.refresh);
router.post("/auth/check",    UserController.isLogged);
router.post("/auth/logout",   UserController.logout);

router.use(loginPrivillege);

router.delete("/:uuid?", UserController.delete);
router.patch("/:uuid?",  UserController.update);

export default router;
