// import razorpayInstance from '../config/razorpay.js';
// import Payment from '../models/Payment.js';
// import Course from '../models/Course.js';
// import User from '../models/User.js';
// import crypto from 'crypto';

// // Create Razorpay Order
// export const createOrder = async (req, res) => {
//     try {
//         const { courseId, userId, studentEmail, studentName } = req.body;

//         if (!courseId || !userId || !studentEmail || !studentName) {
//             return res.status(400).json({
//                 success: false,
//                 error: 'Missing required fields'
//             });
//         }

//         // Get course details
//         const course = await Course.findById(courseId);
//         if (!course) {
//             return res.status(404).json({
//                 success: false,
//                 error: 'Course not found'
//             });
//         }

//         // Create Razorpay order
//         const options = {
//             amount: Math.round(course.price * 100), // Amount in paise
//             currency: 'INR',
//             receipt: `receipt_${Date.now()}`,
//             notes: {
//                 courseId: courseId,
//                 userId: userId,
//                 courseName: course.title
//             }
//         };

//         const order = await razorpayInstance.orders.create(options);

//         // Save payment record
//         const payment = new Payment({
//             razorpayOrderId: order.id,
//             userId,
//             courseId,
//             amount: course.price,
//             currency: 'INR',
//             studentEmail,
//             studentName,
//             courseTitle: course.title,
//             status: 'created'
//         });

//         await payment.save();

//         res.status(200).json({
//             success: true,
//             data: {
//                 orderId: order.id,
//                 amount: course.price,
//                 currency: 'INR',
//                 courseName: course.title
//             }
//         });
//     } catch (error) {
//         console.error('Order creation error:', error);
//         res.status(500).json({
//             success: false,
//             error: error.message
//         });
//     }
// };

// // Verify Razorpay Payment
// export const verifyPayment = async (req, res) => {
//     try {
//         const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

//         if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
//             return res.status(400).json({
//                 success: false,
//                 error: 'Missing payment verification details'
//             });
//         }

//         // Verify signature
//         const body = razorpayOrderId + '|' + razorpayPaymentId;
//         const expectedSignature = crypto
//             .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
//             .update(body.toString())
//             .digest('hex');

//         const isSignatureValid = expectedSignature === razorpaySignature;

//         if (!isSignatureValid) {
//             return res.status(400).json({
//                 success: false,
//                 error: 'Invalid payment signature'
//             });
//         }

//         // Update payment record
//         const payment = await Payment.findOne({ razorpayOrderId });
//         if (!payment) {
//             return res.status(404).json({
//                 success: false,
//                 error: 'Payment record not found'
//             });
//         }

//         payment.razorpayPaymentId = razorpayPaymentId;
//         payment.razorpaySignature = razorpaySignature;
//         payment.status = 'captured';
//         await payment.save();

//         // Add course to user's purchased courses
//         const user = await User.findOne({ clerkId: payment.userId });
//         if (user && !user.purchasedCourses.includes(payment.courseId)) {
//             user.purchasedCourses.push(payment.courseId);
//             await user.save();
//         }

//         // Update course student count
//         await Course.findByIdAndUpdate(
//             payment.courseId,
//             { $inc: { students: 1 } }
//         );

//         res.status(200).json({
//             success: true,
//             message: 'Payment verified successfully',
//             data: payment
//         });
//     } catch (error) {
//         console.error('Payment verification error:', error);
//         res.status(500).json({
//             success: false,
//             error: error.message
//         });
//     }
// };

// // Get payment details
// export const getPaymentDetails = async (req, res) => {
//     try {
//         const { paymentId } = req.params;

//         const payment = await Payment.findById(paymentId).populate('courseId');
//         if (!payment) {
//             return res.status(404).json({
//                 success: false,
//                 error: 'Payment not found'
//             });
//         }

//         res.status(200).json({
//             success: true,
//             data: payment
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             error: error.message
//         });
//     }
// };

// // Get user's payments
// export const getUserPayments = async (req, res) => {
//     try {
//         const { userId } = req.params;

//         const payments = await Payment.find({ userId })
//             .populate('courseId')
//             .sort({ createdAt: -1 });

//         res.status(200).json({
//             success: true,
//             count: payments.length,
//             data: payments
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             error: error.message
//         });
//     }
// };

// // Get all payments (Admin)
// export const getAllPayments = async (req, res) => {
//     try {
//         const payments = await Payment.find()
//             .populate('courseId')
//             .sort({ createdAt: -1 });

//         const totalRevenue = payments
//             .filter(p => p.status === 'captured')
//             .reduce((sum, p) => sum + p.amount, 0);

//         res.status(200).json({
//             success: true,
//             count: payments.length,
//             totalRevenue,
//             data: payments
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             error: error.message
//         });
//     }
// };

import Payment from "../models/Payment.js";
import Course from "../models/Course.js";
import User from "../models/User.js";
import { getFinalPrice } from "../utils/pricing.js";
import Coupon from "../models/Coupon.js";
import { logger } from "../config/logger.js";

const CASHFREE_BASE_URL =
    process.env.CASHFREE_BASE_URL || "https://sandbox.cashfree.com/pg";
const CASHFREE_API_VERSION =
    process.env.CASHFREE_API_VERSION || "2025-01-01";
const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;

const getCashfreeHeaders = () => ({
    "Content-Type": "application/json",
    "x-api-version": CASHFREE_API_VERSION,
    "x-client-id": CASHFREE_APP_ID,
    "x-client-secret": CASHFREE_SECRET_KEY,
});

/* ======================================================
   💳 CREATE ORDER
====================================================== */

export const createOrder = async (req, res) => {
    try {
        const clerkId = req.auth?.userId;

        if (!clerkId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const { courseId, couponCode } = req.body;

        if (!courseId) {
            return res.status(400).json({ success: false, message: "Course ID required" });
        }

        if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
            return res.status(500).json({
                success: false,
                message: "Cashfree keys are not configured",
            });
        }

        const user = await User.findOne({ clerkId });
        const course = await Course.findById(courseId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (!course || !course.isActive) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        // 🚫 Prevent duplicate purchase
        if (user.purchasedCourses.some((id) => id.toString() === course._id.toString())) {
            return res.status(400).json({
                success: false,
                message: "Course already purchased",
            });
        }

        const orderId = `ORD_${course._id}_${Date.now()}`;
        let baseAmount = getFinalPrice(course.price, course.discount || 0);
        let appliedCoupon = null;

        if (couponCode) {
            const coupon = await Coupon.findOne({ code: String(couponCode).toUpperCase().trim() });
            if (!coupon || !coupon.isValidNow()) {
                return res.status(400).json({ success: false, message: "Invalid or expired coupon" });
            }

            if (coupon.type === "percent") {
                baseAmount = getFinalPrice(baseAmount, coupon.value);
            } else {
                baseAmount = Math.max(0, Math.round(baseAmount - Number(coupon.value || 0)));
            }

            coupon.usedCount += 1;
            await coupon.save();
            appliedCoupon = coupon.code;
        }

        const finalAmount = baseAmount;
        const cashfreePayload = {
            order_id: orderId,
            order_amount: finalAmount,
            order_currency: "INR",
            customer_details: {
                customer_id: user._id.toString(),
                customer_name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Student",
                customer_email: user.email || "student@example.com",
                customer_phone: "9999999999",
            },
            order_meta: {
                return_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/pdf/${course._id}?order_id={order_id}`,
            },
        };

        const cashfreeResponse = await fetch(`${CASHFREE_BASE_URL}/orders`, {
            method: "POST",
            headers: getCashfreeHeaders(),
            body: JSON.stringify(cashfreePayload),
        });

        const order = await cashfreeResponse.json();
        if (!cashfreeResponse.ok) {
            return res.status(cashfreeResponse.status).json({
                success: false,
                message: order?.message || "Failed to create Cashfree order",
                data: order,
            });
        }

        await Payment.create({
            razorpayOrderId: order.order_id,
            user: user._id,      // ✅ ObjectId reference
            course: course._id,  // ✅ ObjectId reference
            amount: finalAmount,
            currency: "INR",
            status: "created",
            metadata: {
                studentEmail: user.email,
                studentName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
                courseTitle: course.title,
                cfOrderId: order.cf_order_id,
                couponCode: appliedCoupon,
            }
        });

        res.status(200).json({
            success: true,
            data: {
                orderId: order.order_id,
                paymentSessionId: order.payment_session_id,
                amount: finalAmount,
                currency: "INR",
                courseName: course.title,
            },
        });
    } catch (error) {
        logger.error({ err: error }, "Create order error");
        res.status(500).json({ success: false, message: error.message });
    }
};

/* ======================================================
   ✅ VERIFY PAYMENT
====================================================== */

export const verifyPayment = async (req, res) => {
    try {
        const clerkId = req.auth?.userId;
        if (!clerkId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const user = await User.findOne({ clerkId });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "Order ID is required",
            });
        }

        const payment = await Payment.findOne({ razorpayOrderId: orderId });

        if (!payment || payment.user.toString() !== user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized payment verification",
            });
        }

        const orderStatusResponse = await fetch(`${CASHFREE_BASE_URL}/orders/${orderId}`, {
            method: "GET",
            headers: getCashfreeHeaders(),
        });
        const orderData = await orderStatusResponse.json();

        if (!orderStatusResponse.ok) {
            return res.status(orderStatusResponse.status).json({
                success: false,
                message: orderData?.message || "Failed to fetch Cashfree order status",
                data: orderData,
            });
        }

        if (orderData.order_status !== "PAID") {
            return res.status(400).json({
                success: false,
                message: `Payment not completed. Current status: ${orderData.order_status}`,
                data: orderData,
            });
        }

        if (payment.status === "captured") {
            return res.status(200).json({
                success: true,
                message: "Payment already verified",
            });
        }

        payment.razorpayPaymentId = orderData.cf_order_id || null;
        payment.razorpaySignature = "cashfree_verified";
        payment.status = "captured";
        await payment.save();

        const course = await Course.findById(payment.course);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        // Add course to user
        if (!user.purchasedCourses.some((id) => id.toString() === course._id.toString())) {
            user.purchasedCourses.push(course._id);
            await user.save();
        }

        // Update course analytics
        course.students += 1;
        course.totalRevenue += course.price;
        await course.save();

        res.status(200).json({
            success: true,
            message: "Payment verified successfully",
        });
    } catch (error) {
        logger.error({ err: error }, "Verify payment error");
        res.status(500).json({ success: false, message: error.message });
    }
};

/* ======================================================
   📜 GET MY PAYMENTS
====================================================== */

export const getMyPayments = async (req, res) => {
    try {
        const clerkId = req.auth?.userId;
        if (!clerkId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const user = await User.findOne({ clerkId });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const payments = await Payment.find({ user: user._id })
            .populate("course")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: payments.length,
            data: payments,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/* ======================================================
   👑 GET ALL PAYMENTS (ADMIN ONLY)
====================================================== */

export const getAllPayments = async (req, res) => {
    try {
        const clerkId = req.auth?.userId;
        const user = await User.findOne({ clerkId });

        if (!user || user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Admin access only",
            });
        }

        const payments = await Payment.find()
            .populate("course")
            .sort({ createdAt: -1 });

        const totalRevenue = payments
            .filter((p) => p.status === "captured")
            .reduce((sum, p) => sum + p.amount, 0);

        res.status(200).json({
            success: true,
            count: payments.length,
            totalRevenue,
            data: payments,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
