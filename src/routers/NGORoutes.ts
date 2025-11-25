import { Router } from "express";
import { NGOController } from "../controllers/NGOController";

import { loginChecker           } from "../middlewares/loginChecker";
import { loginRequire           } from "../middlewares/loginRequire";
import { loginManagerPrivillege } from "../middlewares/loginManagerPrivillege";

let router: Router = Router();

router.use(loginChecker);

router.get("/", NGOController.query);

router.use(loginRequire);

router.post("/", NGOController.register);

router.use(loginManagerPrivillege);

router.patch("/:uuid", NGOController.update);
router.delete("/:uuid", NGOController.delete);

export default router;
