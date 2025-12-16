import { Router } from "express";

import { UserDonationReceiptController } from "../controllers/UserDonationReceiptController";

import { resolveUserDonationReceipt } from "../middlewares/resolveUserDonationReceipt";
import { authenticateUser } from "../middlewares/authenticateUser";

let router: Router = Router();

router.get('/', authenticateUser(true), resolveUserDonationReceipt, UserDonationReceiptController.query);
router.post('/', authenticateUser(true), UserDonationReceiptController.create);

export default router;
