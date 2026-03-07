import Course from '../models/Course.js';

// Get all courses with filters
export const getAllCourses = async (filters = {}) => {
    try {
        let query = { isActive: true };

        if (filters.category) {
            query.category = filters.category;
        }

        if (filters.instructor) {
            query.instructor = filters.instructor;
        }

        if (filters.search) {
            query.title = { $regex: filters.search, $options: 'i' };
        }

        const courses = await Course.find(query);

        if (filters.sort) {
            const sortField = filters.sort === 'price' ? 'price' : filters.sort;
            return courses.sort((a, b) => a[sortField] - b[sortField]);
        }

        return courses;
    } catch (error) {
        throw error;
    }
};

// Get all courses (Admin - including inactive)
export const getAllCoursesAdmin = async () => {
    try {
        return await Course.find();
    } catch (error) {
        throw error;
    }
};

// Get course by ID
export const getCourseById = async (id) => {
    try {
        return await Course.findById(id);
    } catch (error) {
        throw error;
    }
};

// Create course
export const createCourse = async (courseData) => {
    try {
        const course = new Course(courseData);
        return await course.save();
    } catch (error) {
        throw error;
    }
};

// Update course
export const updateCourse = async (id, updates) => {
    try {
        return await Course.findByIdAndUpdate(
            id,
            { ...updates, updatedAt: new Date() },
            { new: true }
        );
    } catch (error) {
        throw error;
    }
};

// Delete course
export const deleteCourse = async (id) => {
    try {
        return await Course.findByIdAndDelete(id);
    } catch (error) {
        throw error;
    }
};

// Get courses by author
export const getCoursesByAuthor = async (authorId) => {
    try {
        return await Course.find({ authorId, isActive: true });
    } catch (error) {
        throw error;
    }
};

// Get courses by category
export const getCoursesByCategory = async (category) => {
    try {
        return await Course.find({ category, isActive: true });
    } catch (error) {
        throw error;
    }
};

// Search courses
export const searchCourses = async (searchTerm) => {
    try {
        return await Course.find({
            $or: [
                { title: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } },
                { category: { $regex: searchTerm, $options: 'i' } }
            ],
            isActive: true
        });
    } catch (error) {
        throw error;
    }
};

// Get trending courses (by students enrolled)
export const getTrendingCourses = async (limit = 10) => {
    try {
        return await Course.find({ isActive: true })
            .sort({ students: -1 })
            .limit(limit);
    } catch (error) {
        throw error;
    }
};

// Get top rated courses
export const getTopRatedCourses = async (limit = 10) => {
    try {
        return await Course.find({ isActive: true })
            .sort({ rating: -1 })
            .limit(limit);
    } catch (error) {
        throw error;
    }
};
