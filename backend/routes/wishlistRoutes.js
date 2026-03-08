import express from 'express';
import { requireAuth } from '@clerk/express';
import { addToWishlist, getWishlist, removeFromWishlist } from '../controllers/wishlistController.js';
import { validateBody, validateParams } from '../middleware/validate.js';
import { courseIdParamSchema, wishlistCreateSchema } from '../validation/schemas.js';

const router = express.Router();

router.get('/', requireAuth(), getWishlist);
router.post('/', requireAuth(), validateBody(wishlistCreateSchema), addToWishlist);
router.delete('/:courseId', requireAuth(), validateParams(courseIdParamSchema), removeFromWishlist);

export default router;
