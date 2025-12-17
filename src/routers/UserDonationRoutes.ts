import {Router} from 'express';

import {UserDonationReceiptController} from '../controllers/UserDonationReceiptController';
import {authenticateUser} from '../middlewares/authenticateUser';
import {resolveUserDonationAccess} from '../middlewares/resolveUserDonationAccess';
import {resolveUserDonationReceipt} from '../middlewares/resolveUserDonationReceipt';

const router: Router = Router();

/**
 * Routes for User Donation Receipts.
 * Base Path: /api/donations
 */

router.get(
    '/', authenticateUser(true), UserDonationReceiptController.query);

router.post(
    '/',
    authenticateUser(true),
    UserDonationReceiptController.create);

router.get(
    '/:uuid',
    authenticateUser(true),
    resolveUserDonationReceipt,
    resolveUserDonationAccess,
    (req, res) => res.status(200).json(req.donationReceipt),
);

export default router;
