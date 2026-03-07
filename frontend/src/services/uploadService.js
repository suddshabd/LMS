// Upload service for handling file uploads locally
const uploadService = {
    // Upload file and return base64 or file URL
    uploadFile: async (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                resolve({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    data: reader.result
                });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    },

    // Validate file type
    validateFile: (file, allowedTypes) => {
        return allowedTypes.includes(file.type);
    },

    // Get file size in MB
    getFileSizeInMB: (bytes) => {
        return (bytes / (1024 * 1024)).toFixed(2);
    },

    // Save course data to localStorage
    saveCourse: (courseData) => {
        const courses = JSON.parse(localStorage.getItem('uploadedCourses') || '[]');
        const newCourse = {
            id: Date.now(),
            ...courseData,
            uploadedAt: new Date().toISOString()
        };
        courses.push(newCourse);
        localStorage.setItem('uploadedCourses', JSON.stringify(courses));
        return newCourse;
    },

    // Get all uploaded courses
    getUploadedCourses: () => {
        return JSON.parse(localStorage.getItem('uploadedCourses') || '[]');
    },

    // Delete uploaded course
    deleteCourse: (courseId) => {
        const courses = JSON.parse(localStorage.getItem('uploadedCourses') || '[]');
        const filtered = courses.filter(c => c.id !== courseId);
        localStorage.setItem('uploadedCourses', JSON.stringify(filtered));
    },

    // Update course
    updateCourse: (courseId, updates) => {
        const courses = JSON.parse(localStorage.getItem('uploadedCourses') || '[]');
        const updated = courses.map(c =>
            c.id === courseId ? { ...c, ...updates } : c
        );
        localStorage.setItem('uploadedCourses', JSON.stringify(updated));
    }
};

export default uploadService;
