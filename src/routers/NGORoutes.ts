import { Router } from "express";
import { NGOController } from "../controllers/NGOController";
import { loginChecker           } from "../middlewares/loginChecker";
import { loginRequire           } from "../middlewares/loginRequire";
import { loginManagerPrivillege } from "../middlewares/loginManagerPrivillege";
let router: Router = Router();
router.use(loginChecker);
// Rotas Públicas (ou semi-públicas)
router.get("/", NGOController.query);
router.use(loginRequire);
// Rotas Autenticadas
router.post("/", NGOController.register);
// REMOVIDO: router.use(loginManagerPrivillege); <--- ISSO CAUSAVA O ERRO
// ADICIONADO: Middleware injetado diretamente na rota, após o path '/:uuid'
router.patch("/:uuid", loginManagerPrivillege, NGOController.update);
router.delete("/:uuid", loginManagerPrivillege, NGOController.delete);
export default router;