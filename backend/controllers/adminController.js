import * as userService from '../services/userService.js';
import * as courseService from '../services/courseService.js';

// Get all users (admin)
export const getAllUsers = (req, res) => {
    try {
        const users = userService.getAllUsers();

        res.json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get user by Clerk ID (admin)
export const getUserById = (req, res) => {
    try {
        const user = userService.getUserByClerkId(req.params.clerkId);

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Delete user (admin)
export const deleteUser = (req, res) => {
    try {
        const user = userService.deleteUser(req.params.clerkId);

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.json({
            success: true,
            message: 'User deleted successfully',
            data: user
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get all courses (admin)
export const getAllCourses = (req, res) => {
    try {
        const courses = courseService.getAllCoursesAdmin();

        res.json({
            success: true,
            count: courses.length,
            data: courses
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Delete course (admin)
export const deleteCourse = (req, res) => {
    try {
        const course = courseService.deleteCourse(req.params.courseId);

        if (!course) {
            return res.status(404).json({ success: false, error: 'Course not found' });
        }

        res.json({
            success: true,
            message: 'Course deleted successfully',
            data: course
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get dashboard stats (admin)
export const getDashboardStats = (req, res) => {
    try {
        const users = userService.getAllUsers();
        const courses = courseService.getAllCoursesAdmin();

        const stats = {
            totalUsers: users.length,
            totalCourses: courses.length,
            totalStudents: users.filter(u => u.role === 'student').length,
            totalInstructors: users.filter(u => u.role === 'instructor').length,
            totalRevenue: courses.reduce((sum, c) => sum + (c.price * (c.students || 0)), 0),
            averageRating: courses.length > 0
                ? (courses.reduce((sum, c) => sum + c.rating, 0) / courses.length).toFixed(2)
                : 0
        };

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
