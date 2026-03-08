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
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/dashboard", requireAuth(), requireAdmin, async (req, res) => {
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

router.get("/analytics/instructor", requireAuth(), requireAdmin, async (req, res) => {
    try {
        const paidPayments = await Payment.find({ status: "captured" }).populate("course user");
        const totalPurchases = paidPayments.length;

        const byCategoryMap = {};
        const buyersCount = {};
        for (const payment of paidPayments) {
            const category = payment.course?.category || "Unknown";
            byCategoryMap[category] = (byCategoryMap[category] || 0) + 1;

            const buyer = String(payment.user?._id || "");
            if (buyer) buyersCount[buyer] = (buyersCount[buyer] || 0) + 1;
        }

        const topCategories = Object.entries(byCategoryMap)
            .map(([category, count]) => ({ category, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        const repeatBuyers = Object.values(buyersCount).filter((count) => count > 1).length;
        const conversionRate = totalPurchases > 0
            ? Number(((repeatBuyers / totalPurchases) * 100).toFixed(2))
            : 0;

        return res.status(200).json({
            success: true,
            data: {
                totalPurchases,
                repeatBuyers,
                conversionRate,
                topCategories,
            },
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
