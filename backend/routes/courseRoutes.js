import express from "express";
import {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    deleteNonOwnedCourses
} from "../controllers/courseController.js";

import upload from "../middleware/multer.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { validateBody, validateQuery } from "../middleware/validate.js";
import { courseQuerySchema, updateCourseSchema } from "../validation/schemas.js";

const router = express.Router();

// Public
router.get("/", validateQuery(courseQuerySchema), getCourses);
router.get("/:id", getCourseById);

// Admin only
router.delete("/cleanup/non-owned", requireAuth(), requireAdmin, deleteNonOwnedCourses);

router.post(
    "/",
    requireAuth(),
    requireAdmin,
    upload.fields([
        { name: "pdf", maxCount: 1 },
        { name: "cover", maxCount: 1 }
    ]),
    createCourse
);

router.put("/:id", requireAuth(), requireAdmin, validateBody(updateCourseSchema), updateCourse);
router.delete("/:id", requireAuth(), requireAdmin, deleteCourse);

export default router;
