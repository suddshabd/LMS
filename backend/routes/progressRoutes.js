import express from 'express';
import { requireAuth } from '@clerk/express';
import { getBulkProgress, getProgress, upsertProgress } from '../controllers/progressController.js';
import { validateBody, validateParams, validateQuery } from '../middleware/validate.js';
import { courseIdParamSchema, progressQuerySchema, upsertProgressSchema } from '../validation/schemas.js';

const router = express.Router();

router.get('/', requireAuth(), validateQuery(progressQuerySchema), getBulkProgress);
router.get('/:courseId', requireAuth(), validateParams(courseIdParamSchema), getProgress);
router.put('/:courseId', requireAuth(), validateParams(courseIdParamSchema), validateBody(upsertProgressSchema), upsertProgress);

export default router;
