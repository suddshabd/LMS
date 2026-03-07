
// import axios from "axios";

// const API_URL =
//     import.meta.env.VITE_API_URL || "http://localhost:5003/api";

// const api = axios.create({
//     baseURL: API_URL,
//     withCredentials: true, // ✅ VERY IMPORTANT (Clerk cookies)
//     headers: {
//         "Content-Type": "application/json",
//     },
// });

// /* ==============================
//    RESPONSE INTERCEPTOR
// ============================== */

// api.interceptors.response.use(
//     (response) => response.data,
//     (error) => {
//         console.error("API error:", error.response?.data || error.message);
//         return Promise.reject(
//             error.response?.data || { success: false, message: error.message }
//         );
//     }
// );

// /* ==============================
//    AUTH APIs
// ============================== */

// export const authAPI = {
//     syncUser: (userData) => api.post("/auth/sync", userData),
//     getCurrentUser: () => api.get("/auth/me"),
// };

// /* ==============================
//    COURSE APIs
// ============================== */

// export const courseAPI = {
//     getAllCourses: () => api.get("/courses"),
//     getCourseById: (id) => api.get(`/courses/${id}`),
//     createCourse: (data) => api.post("/courses", data),
//     updateCourse: (id, data) => api.put(`/courses/${id}`, data),
//     deleteCourse: (id) => api.delete(`/courses/${id}`),
// };

// /* ==============================
//    PAYMENT APIs
// ============================== */

// export const paymentAPI = {
//     createOrder: (courseId) =>
//         api.post("/payments/create-order", { courseId }),

//     verifyPayment: (data) =>
//         api.post("/payments/verify", data),

//     getMyPayments: () =>
//         api.get("/payments/my"),

//     getAllPayments: () =>
//         api.get("/payments/admin/all"),
// };

// /* ==============================
//    ADMIN APIs
// ============================== */

// export const adminAPI = {
//     getDashboard: () =>
//         api.get("/admin/dashboard"),
// };

// export default api;
// import axios from 'axios';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5003/api';

// const api = axios.create({
//     baseURL: API_URL,
// });

// // 🔥 Attach Clerk token automatically
// api.interceptors.request.use(async (config) => {
//     const clerk = window.Clerk;

//     if (clerk && clerk.session) {
//         const token = await clerk.session.getToken();
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//     }

//     return config;
// });

// api.interceptors.response.use(
//     (response) => response.data,
//     (error) => {
//         console.error("API Error:", error.response?.data || error.message);
//         return {
//             success: false,
//             error: error.response?.data?.error || error.message,
//         };
//     }
// );

// /* ===========================
//    AUTH APIs
// =========================== */

// export const authAPI = {
//     syncUser: (clerkId, email, firstName, lastName, imageUrl) =>
//         api.post('/auth/sync', {
//             clerkId,
//             email,
//             firstName,
//             lastName,
//             imageUrl,
//         }),

//     getCurrentUser: () =>
//         api.get('/auth/me'),
// };

// /* ===========================
//    COURSE APIs
// =========================== */

// export const courseAPI = {
//     getAllCourses: () => api.get('/courses'),
//     getCourseById: (id) => api.get(`/courses/${id}`),
//     createCourse: (data) => api.post('/courses', data),
//     updateCourse: (id, data) => api.put(`/courses/${id}`, data),
//     deleteCourse: (id) => api.delete(`/courses/${id}`),

//     uploadFiles: (pdfFile, coverFile) => {
//         const formData = new FormData();
//         formData.append('pdf', pdfFile);
//         formData.append('cover', coverFile);

//         return api.post('/courses/upload', formData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//             },
//         });
//     },
// };

// export default api;

// frontend/src/services/apiService.js

import axios from "axios";

const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5003/api";

/*
|--------------------------------------------------------------------------
| AXIOS INSTANCE
|--------------------------------------------------------------------------
*/

export const api = axios.create({
    baseURL: API_URL,
    headers: {

    },
});

api.interceptors.request.use(async (config) => {
    const clerk = window.Clerk;

    if (clerk && clerk.session) {
        const token = await clerk.session.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }

    return config;
});

/*
|--------------------------------------------------------------------------
| AUTH API
|--------------------------------------------------------------------------
*/

export const authAPI = {
    syncUser: (data, token) =>
        api.post("/auth/sync", data, {
            headers: { Authorization: `Bearer ${token}` },
        }),

    getCurrentUser: (token) =>
        api.get("/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
        }),
};

/*
|--------------------------------------------------------------------------
| COURSE API
|--------------------------------------------------------------------------
*/

export const courseAPI = {
    getAllCourses: (params = {}) =>
        api.get("/courses", { params }),

    getCourseById: (id) => api.get(`/courses/${id}`),

    createCourse: (formData) =>
        api.post("/courses", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }),

    updateCourse: (id, data, token) =>
        api.put(`/courses/${id}`, data, {
            headers: { Authorization: `Bearer ${token}` },
        }),

    deleteCourse: (id, token) =>
        api.delete(`/courses/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        }),

    deleteNonOwnedCourses: (token) =>
        api.delete("/courses/cleanup/non-owned", {
            headers: { Authorization: `Bearer ${token}` },
        }),

    uploadFiles: (formData, token) =>
        api.post("/upload", formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        }),
};

/*
|--------------------------------------------------------------------------
| PAYMENT API
|--------------------------------------------------------------------------
*/

export const paymentAPI = {
    createOrder: (courseId) =>
        api.post("/payments/create-order", { courseId }),

    verifyPayment: (payload) =>
        api.post("/payments/verify", payload),

    getMyPayments: () =>
        api.get("/payments/my"),

    getAllPayments: () =>
        api.get("/payments/admin/all"),
};

/*
|--------------------------------------------------------------------------
| ADMIN API
|--------------------------------------------------------------------------
*/

export const adminAPI = {
    getDashboardStats: (token) =>
        api.get("/admin/stats", {
            headers: { Authorization: `Bearer ${token}` },
        }),

    getAllUsers: (token) =>
        api.get("/admin/users", {
            headers: { Authorization: `Bearer ${token}` },
        }),

    deleteUser: (clerkId, token) =>
        api.delete(`/admin/users/${clerkId}`, {
            headers: { Authorization: `Bearer ${token}` },
        }),

    getAllCourses: (token) =>
        api.get("/admin/courses", {
            headers: { Authorization: `Bearer ${token}` },
        }),

    deleteCourse: (courseId, token) =>
        api.delete(`/admin/courses/${courseId}`, {
            headers: { Authorization: `Bearer ${token}` },
        }),
};

/*
|--------------------------------------------------------------------------
| GLOBAL ERROR HANDLER
|--------------------------------------------------------------------------
*/

api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        console.error(
            "API Error:",
            error.response?.data || error.message
        );

        return Promise.reject(
            error.response?.data || { message: error.message }
        );
    }
);

export default api;
