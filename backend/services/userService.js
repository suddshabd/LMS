// backend/services/userService.js
import User from '../models/User.js';
import { logger } from '../config/logger.js';

const userService = {
    /**
     * Syncs user data from Clerk with the backend database.
     * Creates a new user if they don't exist, or updates existing user details.
     * Assigns 'student' as the default role for new users.
     */
    syncUser: async ({ clerkId, email, firstName, lastName, avatar }) => {
        try {
            let user = await User.findOne({ clerkId });

            if (user) {
                // User exists → update details
                user.email = email;
                user.firstName = firstName;
                user.lastName = lastName;
                user.avatar = avatar;

                await user.save();

                return {
                    success: true,
                    data: user,
                    message: "User updated successfully"
                };
            } else {
                // New user → create with default role
                user = await User.create({
                    clerkId,
                    email,
                    firstName,
                    lastName,
                    avatar,
                    role: 'student',
                });

                return {
                    success: true,
                    data: user,
                    message: "User created successfully"
                };
            }

        } catch (error) {
            logger.error({ err: error }, "Error syncing user");
            return {
                success: false,
                error: error.message
            };
        }
    },

    /**
     * Retrieves a user by their Clerk ID.
     */
    // getUserByClerkId: async (clerkId) => {
    //     try {
    //         const user = await User.findOne({ clerkId });

    //         if (!user) {
    //             return { success: false, error: "User not found" };
    //         }

    //         return { success: true, data: user };

    //     } catch (error) {
    //         console.error("Error fetching user:", error);
    //         return { success: false, error: error.message };
    //     }
    // },
    getUserByClerkId: async (clerkId) => {
        const user = await User.findOne({ clerkId });

        if (!user) {
            return { success: false, error: "User not found" };
        }

        return { success: true, user };
    },

};

export default userService;
