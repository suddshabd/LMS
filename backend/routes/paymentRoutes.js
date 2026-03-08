// import express from 'express';
// import * as paymentController from '../controllers/paymentController.js';

// const router = express.Router();

// // Create order
// router.post('/create-order', paymentController.createOrder);

// // Verify payment
// router.post('/verify-payment', paymentController.verifyPayment);

// // Get payment details
// router.get('/:paymentId', paymentController.getPaymentDetails);

// // Get user's payments
// router.get('/user/:userId', paymentController.getUserPayments);

// // Get all payments (Admin)
// router.get('/admin/all-payments', paymentController.getAllPayments);

// export default router;

import express from "express";
import {
    createOrder,
    verifyPayment,
    getMyPayments,
    getAllPayments
} from "../controllers/paymentController.js";
import { requireAuth } from "@clerk/express";
import { validateBody } from "../middleware/validate.js";
import { paymentLimiter } from "../middleware/rateLimiters.js";
import { createOrderSchema, verifyPaymentSchema } from "../validation/schemas.js";

const router = express.Router();

router.post("/create-order", paymentLimiter, requireAuth(), validateBody(createOrderSchema), createOrder);
router.post("/verify", paymentLimiter, requireAuth(), validateBody(verifyPaymentSchema), verifyPayment);
router.get("/my", requireAuth(), getMyPayments);
router.get("/admin/all", requireAuth(), getAllPayments);

export default router;
