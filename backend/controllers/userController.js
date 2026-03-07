// // // backend/controllers/userController.js
// // import userService from '../services/userService.js';

// // const userController = {
// //     /**
// //      * Handles the POST /api/users/sync request.
// //      * Syncs user data from Clerk with the backend.
// //      */
// //     syncUser: async (req, res) => {
// //         console.log("🔥 SYNC CONTROLLER HIT");
// //         try {

// //             const { clerkId, email, firstName, lastName, avatar } = req.body;

// //             if (!clerkId || !email) {
// //                 return res.status(400).json({
// //                     success: false,
// //                     error: "Clerk ID and email are required."
// //                 });
// //             }

// //             const result = await userService.syncUser({
// //                 clerkId,
// //                 email,
// //                 firstName,
// //                 lastName,
// //                 avatar
// //             });

// //             if (result.success) {
// //                 return res.status(200).json(result);
// //             } else {
// //                 return res.status(500).json(result);
// //             }

// //         } catch (error) {
// //             console.error("Error syncing user:", error);
// //             return res.status(500).json({
// //                 success: false,
// //                 error: "Internal server error"
// //             });
// //         }
// //     },

// //     // You can add other user-related controller methods here
// // };

// // export default userController;

// // backend/controllers/userController.js
// import userService from '../services/userService.js';

// const userController = {
//     syncUser: async (req, res) => {
//         console.log("🔥 [1] SYNC CONTROLLER HIT");

//         try {
//             console.log("🔥 [2] Request body received:", req.body);

//             const { clerkId, email, firstName, lastName, avatar } = req.body;

//             if (!clerkId || !email) {
//                 console.log("❌ [3] Missing clerkId or email");
//                 return res.status(400).json({
//                     success: false,
//                     error: "Clerk ID and email are required."
//                 });
//             }

//             console.log("🔥 [4] Calling userService.syncUser...");

//             const result = await userService.syncUser({
//                 clerkId,
//                 email,
//                 firstName,
//                 lastName,
//                 avatar
//             });

//             console.log("🔥 [5] Service returned:", result);

//             if (result.success) {
//                 console.log("✅ [6] Sending 200 response");
//                 return res.status(200).json(result);
//             } else {
//                 console.log("❌ [7] Service returned failure");
//                 return res.status(500).json(result);
//             }

//         } catch (error) {
//             console.error("💥 [8] Error inside controller:", error);
//             return res.status(500).json({
//                 success: false,
//                 error: "Internal server error"
//             });
//         }
//     },
// };

// export default userController;
import userService from '../services/userService.js';

const userController = {

    syncUser: async (req, res) => {
        try {
            const { clerkId, email, firstName, lastName, avatar } = req.body;

            if (!clerkId || !email) {
                return res.status(400).json({
                    success: false,
                    error: "Clerk ID and email are required."
                });
            }

            const result = await userService.syncUser({
                clerkId,
                email,
                firstName,
                lastName,
                avatar
            });

            return res.status(result.success ? 200 : 500).json(result);

        } catch (error) {
            console.error("Sync error:", error);
            return res.status(500).json({
                success: false,
                error: "Internal server error"
            });
        }
    },

    /**
     * GET /api/users/me
     * Get logged-in user profile
     */
    getUserProfile: async (req, res) => {
        try {
            const clerkId = req.auth?.userId;

            if (!clerkId) {
                return res.status(401).json({
                    success: false,
                    error: "Unauthorized"
                });
            }

            const result = await userService.getUserByClerkId(clerkId);

            return res.status(result.success ? 200 : 404).json(result);

        } catch (error) {
            console.error("Get profile error:", error);
            return res.status(500).json({
                success: false,
                error: "Internal server error"
            });
        }
    },

    /**
     * PUT /api/users/me
     * Update logged-in user profile
     */
    updateUserProfile: async (req, res) => {
        try {
            const clerkId = req.auth?.userId;

            if (!clerkId) {
                return res.status(401).json({
                    success: false,
                    error: "Unauthorized"
                });
            }

            const updates = req.body;

            const result = await userService.updateUserByClerkId(
                clerkId,
                updates
            );

            return res.status(result.success ? 200 : 400).json(result);

        } catch (error) {
            console.error("Update profile error:", error);
            return res.status(500).json({
                success: false,
                error: "Internal server error"
            });
        }
    }

};

export default userController;
