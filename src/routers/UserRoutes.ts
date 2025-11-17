import { Router } from "express";
import { UserController } from "../controllers/UserController";


let router: Router = Router();


router.delete("/users/:id", UserController.delete);
router.put("/users/:id", UserController.update)


router.post("/users", UserController.register);
router.get("/users", UserController.index);


export default router;