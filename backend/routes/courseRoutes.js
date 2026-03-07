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

const router = express.Router();

// Public
router.get("/", getCourses);
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

router.put("/:id", requireAuth(), requireAdmin, updateCourse);
router.delete("/:id", requireAuth(), requireAdmin, deleteCourse);

export default router;
