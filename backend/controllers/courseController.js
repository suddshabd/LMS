

import Course from "../models/Course.js";
import User from "../models/User.js";
import * as courseService from "../services/courseService.js";
import { uploadToCloudinary } from "../config/cloudinary.js";
import { logger } from "../config/logger.js";

const normalizeCloudinaryPdfUrl = (url) => {
    if (!url || typeof url !== "string") return url;
    if (!url.includes("/res.cloudinary.com/")) return url;
    const lowerUrl = url.toLowerCase();
    const looksLikePdfAsset =
        lowerUrl.includes(".pdf") || lowerUrl.includes("/pib-bits/pdfs/");
    if (!looksLikePdfAsset) return url;
    return url.replace("/image/upload/", "/raw/upload/");
};

/* ======================================================
   📚 GET ALL COURSES (Public)
====================================================== */

export const getCourses = async (req, res) => {
    try {
        const { category, search, sort, instructor } = req.query;

        const filters = { category, search, sort, instructor };
        const courses = await courseService.getAllCourses(filters);
        const normalizedCourses = courses.map((course) => ({
            ...course.toObject(),
            pdfUrl: normalizeCloudinaryPdfUrl(course.pdfUrl),
        }));

        res.status(200).json({
            success: true,
            count: normalizedCourses.length,
            data: normalizedCourses,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteNonOwnedCourses = async (req, res) => {
    try {
        const clerkUserId = req.auth?.userId;

        if (!clerkUserId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const adminUser = await User.findOne({ clerkId: clerkUserId });

        if (!adminUser) {
            return res.status(404).json({
                success: false,
                message: "Admin user not found",
            });
        }

        const result = await Course.updateMany(
            { isActive: true, instructor: { $ne: adminUser._id } },
            { $set: { isActive: false } }
        );

        return res.status(200).json({
            success: true,
            message: "Non-owned courses removed from active listings",
            data: { modifiedCount: result.modifiedCount || 0 },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/* ======================================================
   📖 GET SINGLE COURSE (Public)
====================================================== */

export const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate("instructor", "firstName lastName email");

        if (!course || !course.isActive) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        res.status(200).json({
            success: true,
            data: {
                ...course.toObject(),
                pdfUrl: normalizeCloudinaryPdfUrl(course.pdfUrl),
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/* ======================================================
   ➕ CREATE COURSE (Admin Only + Upload Inside)
====================================================== */

// export const createCourse = async (req, res) => {
//     try {
//         // requireAdmin middleware ensures:
//         // - user is authenticated
//         // - user is admin
//         // - req.user exists

//         if (!req.files || !req.files.pdf) {
//             return res.status(400).json({
//                 success: false,
//                 message: "PDF file is required",
//             });
//         }

//         const { title, category, price, ...rest } = req.body;

//         if (!title || !category || !price) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Missing required fields",
//             });
//         }

//         /* ===============================
//            🔥 Upload PDF
//         =============================== */

//         const pdfFile = req.files.pdf[0];

//         const pdfUpload = await uploadToCloudinary(
//             pdfFile.buffer,
//             `pdf_${Date.now()}`,
//             "pib-bits/pdfs"
//         );

//         /* ===============================
//            🔥 Upload Cover (Optional)
//         =============================== */

//         let coverUrl = null;

//         if (req.files.cover) {
//             const coverFile = req.files.cover[0];

//             const coverUpload = await uploadToCloudinary(
//                 coverFile.buffer,
//                 `cover_${Date.now()}`,
//                 "pib-bits/covers"
//             );

//             coverUrl = coverUpload.secure_url;
//         }

//         /* ===============================
//            🔥 Create Course
//         =============================== */

//         const course = await Course.create({
//             title,
//             category,
//             price,
//             pdfUrl: pdfUpload.secure_url,
//             coverUrl,
//             instructor: req.user._id,
//             ...rest,
//         });

//         res.status(201).json({
//             success: true,
//             message: "Course created successfully",
//             data: course,
//         });

//     } catch (error) {
//         console.error("Create course error:", error);

//         res.status(500).json({
//             success: false,
//             message: "Course creation failed",
//         });
//     }
// };

export const createCourse = async (req, res) => {
    try {
        // 🔐 Clerk user ID
        const clerkUserId = req.auth?.userId;

        if (!clerkUserId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        // 🔎 Find MongoDB user
        const instructorUser = await User.findOne({ clerkId: clerkUserId });

        if (!instructorUser) {
            return res.status(404).json({
                success: false,
                message: "User not found in database",
            });
        }

        if (!req.files || !req.files.pdf) {
            return res.status(400).json({
                success: false,
                message: "PDF file is required",
            });
        }

        const { title, category, price, discount, ...rest } = req.body;

        if (!title || !category || !price) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
            });
        }

        const parsedDiscount = Number(discount ?? 0);
        const safeDiscount = Number.isFinite(parsedDiscount)
            ? Math.min(100, Math.max(0, parsedDiscount))
            : 0;

        /* ===============================
           🔥 Upload PDF
        =============================== */

        const pdfFile = req.files.pdf[0];

        const pdfUpload = await uploadToCloudinary(
            pdfFile.buffer,
            `pdf_${Date.now()}.pdf`,
            "pib-bits/pdfs",
            { resourceType: "raw" }
        );

        /* ===============================
           🔥 Upload Cover (Optional)
        =============================== */

        let coverUrl = null;

        if (req.files.cover) {
            const coverFile = req.files.cover[0];

            const coverUpload = await uploadToCloudinary(
                coverFile.buffer,
                `cover_${Date.now()}`,
                "pib-bits/covers"
            );

            coverUrl = coverUpload.secure_url;
        }

        /* ===============================
           🔥 Create Course
        =============================== */

        const course = await Course.create({
            title,
            category,
            price,
            discount: safeDiscount,
            pdfUrl: pdfUpload.secure_url,
            coverUrl,
            instructor: instructorUser._id,  // ✅ FIXED
            ...rest,
        });

        res.status(201).json({
            success: true,
            message: "Course created successfully",
            data: {
                ...course.toObject(),
                pdfUrl: normalizeCloudinaryPdfUrl(course.pdfUrl),
            },
        });

    } catch (error) {
        logger.error({ err: error }, "Create course error");

        res.status(500).json({
            success: false,
            message: "Course creation failed",
        });
    }
};
/* ======================================================
   ✏ UPDATE COURSE (Admin Only)
====================================================== */

export const updateCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        Object.assign(course, req.body);
        await course.save();

        res.status(200).json({
            success: true,
            message: "Course updated successfully",
            data: course,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/* ======================================================
   🗑 DELETE COURSE (Soft Delete - Admin Only)
====================================================== */

export const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        course.isActive = false;
        await course.save();

        res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
