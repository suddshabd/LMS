
import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        slug: {
            type: String,
            unique: true,
            lowercase: true,
        },

        description: {
            type: String,
            trim: true,
        },

        category: {
            type: String,
            enum: ["Banking", "SSC", "Government", "General"],
            required: true,
            index: true,
        },

        subcategory: {
            type: String,
            trim: true,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
            index: true,
        },

        discount: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },

        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        pages: {
            type: Number,
            default: 0,
        },

        rating: {
            type: Number,
            default: 4.5,
            min: 0,
            max: 5,
            index: true,
        },

        reviews: {
            type: Number,
            default: 0,
        },

        students: {
            type: Number,
            default: 0,
        },

        downloads: {
            type: Number,
            default: 0,
        },

        totalRevenue: {
            type: Number,
            default: 0,
        },

        features: [
            {
                type: String,
                trim: true,
            },
        ],

        pdfUrl: {
            type: String,
            required: true,
        },

        coverUrl: {
            type: String,
        },

        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

/* ======================================================
   🔎 INDEXES FOR PERFORMANCE
====================================================== */

courseSchema.index({ title: "text", description: "text" });
courseSchema.index({ category: 1 });
courseSchema.index({ price: 1 });
courseSchema.index({ rating: -1 });

/* ======================================================
   🔥 AUTO-GENERATE SLUG
====================================================== */

courseSchema.pre("save", function (next) {
    if (this.isModified("title")) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");
    }
    next();
});

export default mongoose.model("Course", courseSchema);
