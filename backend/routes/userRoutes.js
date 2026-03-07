// // // backend/routes/userRoutes.js

// // import express from "express";
// // import userController from "../controllers/userController.js";

// // const router = express.Router();

// // /**
// //  * POST /api/users/sync
// //  * Sync user data from Clerk to database
// //  */
// // router.post("/sync", userController.syncUser);

// // export default router;
// // backend/routes/userRoutes.js

// import express from "express";
// import userController from "../controllers/userController.js";
// import { requireAuth } from "../middleware/auth.js";

// const router = express.Router();

// /**
//  * POST /api/users/sync
//  */
// router.post("/sync", userController.syncUser);

// /**
//  * GET /api/users/me
//  */
// router.get("/me", requireAuth, userController.getUserProfile);

// /**
//  * PUT /api/users/me
//  */
// router.put("/me", requireAuth, userController.updateUserProfile);

// export default router;

import express from "express";
import User from "../models/User.js";
import { requireAuth } from "@clerk/express";

const router = express.Router();

// Get all users (Admin only)
router.get("/", requireAuth(), async (req, res) => {
    try {
        const users = await User.find().select("-__v");
        res.json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;