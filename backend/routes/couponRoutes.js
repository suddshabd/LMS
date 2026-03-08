import express from 'express';
import { requireAuth } from '@clerk/express';
import { requireAdmin } from '../middleware/auth.js';
import { createCoupon, getCoupons, updateCoupon } from '../controllers/couponController.js';
import { validateBody, validateParams } from '../middleware/validate.js';
import { createCouponSchema, mongoIdParamSchema, updateCouponSchema } from '../validation/schemas.js';

const router = express.Router();

router.get('/', requireAuth(), requireAdmin, getCoupons);
router.post('/', requireAuth(), requireAdmin, validateBody(createCouponSchema), createCoupon);
router.put('/:id', requireAuth(), requireAdmin, validateParams(mongoIdParamSchema), validateBody(updateCouponSchema), updateCoupon);

export default router;
