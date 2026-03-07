// import mongoose from 'mongoose';

// const paymentSchema = new mongoose.Schema({
//     razorpayOrderId: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     razorpayPaymentId: {
//         type: String,
//         default: null
//     },
//     razorpaySignature: {
//         type: String,
//         default: null
//     },
//     userId: {
//         type: String,
//         required: true
//     },
//     courseId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Course',
//         required: true
//     },
//     amount: {
//         type: Number,
//         required: true
//     },
//     currency: {
//         type: String,
//         default: 'INR'
//     },
//     status: {
//         type: String,
//         enum: ['created', 'authorized', 'captured', 'refunded', 'failed'],
//         default: 'created'
//     },
//     studentEmail: {
//         type: String,
//         required: true
//     },
//     studentName: {
//         type: String,
//         required: true
//     },
//     courseTitle: {
//         type: String,
//         required: true
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

// export default mongoose.model('Payment', paymentSchema);

import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        razorpayOrderId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        razorpayPaymentId: {
            type: String,
            default: null,
        },

        razorpaySignature: {
            type: String,
            default: null,
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
            index: true,
        },

        amount: {
            type: Number,
            required: true,
            min: 0,
        },

        currency: {
            type: String,
            default: "INR",
        },

        status: {
            type: String,
            enum: ["created", "authorized", "captured", "refunded", "failed"],
            default: "created",
            index: true,
        },

        // Immutable snapshot (optional but professional)
        metadata: {
            studentEmail: String,
            studentName: String,
            courseTitle: String,
        },

        refundedAt: {
            type: Date,
            default: null,
        },

        refundAmount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

/* ======================================================
   📊 INDEXES FOR PERFORMANCE
====================================================== */

paymentSchema.index({ user: 1 });
paymentSchema.index({ course: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });

export default mongoose.model("Payment", paymentSchema);