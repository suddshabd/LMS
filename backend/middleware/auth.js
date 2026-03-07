import { requireAuth } from "@clerk/express";
import User from "../models/User.js";

// Just re-export Clerk middleware directly
export { requireAuth };

export const requireAdmin = async (req, res, next) => {
    try {
        // Clerk puts userId directly on req.auth
        const userId = req.auth?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: "Unauthorized",
            });
        }

        const user = await User.findOne({ clerkId: userId });

        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found",
            });
        }

        if (user.role !== "admin") {
            return res.status(403).json({
                success: false,
                error: "Access denied. Admin only.",
            });
        }

        next();
    } catch (error) {
        console.error("requireAdmin error:", error);
        res.status(500).json({
            success: false,
            error: "Server error",
        });
    }
};