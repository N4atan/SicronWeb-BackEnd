import { Router } from "express";
import { OngController } from "../controllers/OngController";


let router: Router = Router();


// router.put("/users/:id", OngController.update) -> Implementar se necessário
router.delete("/ongs/:id", OngController.delete);
router.patch('/ongs/:id', OngController.updatePartial);

router.post("/ongs", OngController.register);
router.get("/ongs", OngController.list); // Recebe query params para filtro


export default router;