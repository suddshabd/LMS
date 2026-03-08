import express from 'express';
import { requireAuth } from '@clerk/express';
import { requireAdmin } from '../middleware/auth.js';
import { createReview, getApprovedReviews, moderateReview } from '../controllers/reviewController.js';
import { validateBody, validateParams } from '../middleware/validate.js';
import {
  courseIdParamSchema,
  createReviewSchema,
  moderateReviewSchema,
  reviewIdParamSchema,
} from '../validation/schemas.js';

const router = express.Router();

router.get('/course/:courseId', validateParams(courseIdParamSchema), getApprovedReviews);
router.post('/', requireAuth(), validateBody(createReviewSchema), createReview);
router.patch('/:id/moderate', requireAuth(), requireAdmin, validateParams(reviewIdParamSchema), validateBody(moderateReviewSchema), moderateReview);

export default router;
