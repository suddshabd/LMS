// import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema({
//     clerkId: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//         lowercase: true
//     },
//     firstName: String,
//     lastName: String,
//     avatar: String,
//     role: {
//         type: String,
//         enum: ['student', 'instructor', 'admin'],
//         default: 'student'
//     },
//     bio: String,
//     profileImage: String,
//     purchasedCourses: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Course'
//     }],
//     createdCourses: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Course'
//     }],
//     isActive: {
//         type: Boolean,
//         default: true
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     },
//     updatedAt: {
//         type: Date,
//         default: Date.now
//     }
// });

// export default mongoose.model('User', userSchema);

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        clerkId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },

        firstName: {
            type: String,
            trim: true,
        },

        lastName: {
            type: String,
            trim: true,
        },

        avatar: {
            type: String,
        },

        role: {
            type: String,
            enum: ["student", "instructor", "admin"],
            default: "student",
            index: true,
        },

        bio: {
            type: String,
            maxlength: 500,
        },

        profileImage: {
            type: String,
        },

        purchasedCourses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course",
            },
        ],

        wishlistCourses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course",
            },
        ],

        createdCourses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course",
            },
        ],

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true, // Automatically manages createdAt & updatedAt
    }
);

/* ======================================================
   🔎 INDEXES (Performance Optimization)
====================================================== */

userSchema.index({ clerkId: 1 });
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

/* ======================================================
   🎯 VIRTUALS
====================================================== */

userSchema.virtual("fullName").get(function () {
    return `${this.firstName || ""} ${this.lastName || ""}`.trim();
});

export default mongoose.model("User", userSchema);
