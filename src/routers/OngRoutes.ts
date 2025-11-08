import { Router } from "express";
import { OngController } from "../controllers/OngController";


let router: Router = Router();

// router.get("/users/:id", OngController.show);
// router.delete("/users/:id", OngController.delete);
// router.put("/users/:id", OngController.update)


router.post("/ongs", OngController.register);
router.get("/ongs", OngController.list);


export default router;