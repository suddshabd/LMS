// import express from "express";
// import * as adminController from "../controllers/adminController.js";
// import { requireAuth, requireAdmin } from "../middleware/auth.js";

// const router = express.Router();

// router.use(requireAuth);
// router.use(requireAdmin);

// router.get("/users", adminController.getAllUsers);
// router.get("/users/:clerkId", adminController.getUserById);
// router.delete("/users/:clerkId", adminController.deleteUser);
// router.get("/courses", adminController.getAllCourses);
// router.delete("/courses/:courseId", adminController.deleteCourse);
// router.get("/stats", adminController.getDashboardStats);

// export default router;

import express from "express";
import User from "../models/User.js";
import Course from "../models/Course.js";
import Payment from "../models/Payment.js";
import { requireAuth } from "@clerk/express";

const router = express.Router();

router.get("/dashboard", requireAuth(), async (req, res) => {
    try {
        const users = await User.countDocuments();
        const courses = await Course.countDocuments();
        const revenue = await Payment.aggregate([
            { $match: { status: "captured" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        res.json({
            success: true,
            data: {
                totalUsers: users,
                totalCourses: courses,
                totalRevenue: revenue[0]?.total || 0
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;