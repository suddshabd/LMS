// import User from "../models/User.js";

// /**
//  * POST /api/auth/sync
//  * Sync Clerk user with MongoDB
//  */
// export const syncUser = async (req, res) => {
//     try {
//         const clerkId = req.auth?.userId;

//         if (!clerkId) {
//             return res.status(401).json({
//                 success: false,
//                 error: "Unauthorized",
//             });
//         }

//         const { email, firstName, lastName, imageUrl } = req.body;

//         let user = await User.findOne({ clerkId });

//         if (!user) {
//             // Create new user (default role = student)
//             user = await User.create({
//                 clerkId,
//                 email,
//                 name: `${firstName || ""} ${lastName || ""}`.trim(),
//                 avatar: imageUrl,
//                 // role: "student",
//             });
//         } else {
//             // Update basic profile info ONLY
//             user.email = email || user.email;
//             user.name =
//                 `${firstName || ""} ${lastName || ""}`.trim() || user.name;
//             user.avatar = imageUrl || user.avatar;

//             // IMPORTANT: DO NOT TOUCH role here

//             await user.save();
//         }

//         return res.status(200).json({
//             success: true,
//             user,
//         });

//     } catch (error) {
//         console.error("Sync user error:", error);
//         return res.status(500).json({
//             success: false,
//             error: "Failed to sync user",
//         });
//     }
// };



// /**
//  * GET /api/auth/me
//  * Get current logged-in user from DB
//  */
// export const getCurrentUser = async (req, res) => {
//     try {
//         const clerkId = req.auth?.userId;

//         if (!clerkId) {
//             return res.status(401).json({
//                 success: false,
//                 error: "Unauthorized",
//             });
//         }

//         const user = await User.findOne({ clerkId });

//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 error: "User not found",
//             });
//         }

//         return res.status(200).json({
//             success: true,
//             user,
//         });

//     } catch (error) {
//         console.error("Get current user error:", error);
//         return res.status(500).json({
//             success: false,
//             error: "Server error",
//         });
//     }
// };



// /**
//  * PATCH /api/auth/make-admin
//  * DEV ONLY — promotes current user to admin
//  */
// export const makeAdmin = async (req, res) => {
//     try {
//         const clerkId = req.auth?.userId;

//         if (!clerkId) {
//             return res.status(401).json({
//                 success: false,
//                 error: "Unauthorized",
//             });
//         }

//         const user = await User.findOneAndUpdate(
//             { clerkId },
//             { role: "admin" },
//             { new: true }
//         );

//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 error: "User not found",
//             });
//         }

//         return res.status(200).json({
//             success: true,
//             message: "User promoted to admin",
//             user,
//         });

//     } catch (error) {
//         console.error("Make admin error:", error);
//         return res.status(500).json({
//             success: false,
//             error: "Server error",
//         });
//     }
// };


import User from "../models/User.js";
import { logger } from "../config/logger.js";

/* ======================================================
   🔄 POST /api/auth/sync
   Sync Clerk user with MongoDB
====================================================== */

export const syncUser = async (req, res) => {
    try {
        const clerkId = req.auth?.userId;

        if (!clerkId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const { email, firstName, lastName, imageUrl } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        let user = await User.findOne({ clerkId });

        /* ==============================
           🆕 CREATE NEW USER
        ============================== */
        if (!user) {
            user = await User.create({
                clerkId,
                email,
                firstName,
                lastName,
                avatar: imageUrl,
                role: "student", // Default role ONLY at creation
            });
        } else {
            /* ==============================
               🔁 UPDATE SAFE FIELDS ONLY
            ============================== */

            user.email = email || user.email;
            user.firstName = firstName || user.firstName;
            user.lastName = lastName || user.lastName;
            user.avatar = imageUrl || user.avatar;

            // 🚨 NEVER TOUCH ROLE HERE

            await user.save();
        }

        return res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        logger.error({ err: error }, "Sync user error");

        return res.status(500).json({
            success: false,
            message: "Failed to sync user",
        });
    }
};

/* ======================================================
   👤 GET /api/auth/me
   Get current logged-in user
====================================================== */

export const getCurrentUser = async (req, res) => {
    try {
        const clerkId = req.auth?.userId;

        if (!clerkId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const user = await User.findOne({ clerkId })
            .populate("purchasedCourses")
            .populate("createdCourses");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        logger.error({ err: error }, "Get current user error");

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

/* ======================================================
   👑 PATCH /api/auth/make-admin
   ⚠️ DEV ONLY — Protected by secret key
====================================================== */

export const makeAdmin = async (req, res) => {
    try {
        const clerkId = req.auth?.userId;
        const { secretKey } = req.body;

        if (!clerkId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        // 🔐 Protect with environment secret
        if (secretKey !== process.env.ADMIN_SECRET) {
            return res.status(403).json({
                success: false,
                message: "Invalid secret key",
            });
        }

        const user = await User.findOneAndUpdate(
            { clerkId },
            { role: "admin" },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User promoted to admin",
            user,
        });
    } catch (error) {
        logger.error({ err: error }, "Make admin error");

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
