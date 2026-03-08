// import express from "express";
// import { requireAuth } from "../middleware/auth.js";
// import * as authController from "../controllers/authController.js";

// const router = express.Router();

// /**
//  * Sync Clerk user to MongoDB
//  * Creates user if not exists
//  * Does NOT overwrite admin role
//  */
// router.post("/sync", requireAuth, authController.syncUser);

// /**
//  * Get current logged-in user (from DB)
//  */
// router.get("/me", requireAuth, authController.getCurrentUser);

// /**
//  * Update role manually (DEV ONLY - remove in production)
//  */
// router.patch("/make-admin", requireAuth, authController.makeAdmin);

// export default router;
import express from "express";
import { syncUser, getCurrentUser, makeAdmin } from "../controllers/authController.js";
import { requireAuth } from "@clerk/express";
import { validateBody } from "../middleware/validate.js";
import { authLimiter } from "../middleware/rateLimiters.js";
import { makeAdminSchema, syncUserSchema } from "../validation/schemas.js";

const router = express.Router();

router.post("/sync", authLimiter, requireAuth(), validateBody(syncUserSchema), syncUser);
router.get("/me", requireAuth(), getCurrentUser);
router.patch("/make-admin", authLimiter, requireAuth(), validateBody(makeAdminSchema), makeAdmin);

export default router;
