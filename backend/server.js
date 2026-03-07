
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { clerkMiddleware } from "@clerk/express";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

// Import routes
import courseRoutes from "./routes/courseRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

const app = express();

/* ======================================================
   🔐 SECURITY MIDDLEWARE
====================================================== */

// Helmet for secure HTTP headers
app.use(helmet());

// Rate limiting (protects against brute force & abuse)
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // limit each IP
    message: "Too many requests from this IP, please try again later.",
});

app.use("/api", apiLimiter);

/* ======================================================
   🌍 CORS CONFIG (Clerk + Frontend Safe)
====================================================== */

app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

/* ======================================================
   📦 BODY PARSERS
====================================================== */

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* ======================================================
   🔑 AUTH MIDDLEWARE (Clerk)
====================================================== */

app.use(clerkMiddleware());
app.use((req, res, next) => {
    console.log("AUTH OBJECT:", req.auth);
    next();
});

/* ======================================================
   🗄️ DATABASE CONNECTION
====================================================== */

mongoose
    .connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
    })
    .then(() => {
        console.log("✅ MongoDB connected successfully");
    })
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err.message);
        process.exit(1);
    });

/* ======================================================
   📌 API ROUTES
====================================================== */

app.use("/api/courses", courseRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);

/* ======================================================
   ❤️ HEALTH CHECK
====================================================== */

app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "Backend is running 🚀",
        database:
            mongoose.connection.readyState === 1
                ? "Connected"
                : "Disconnected",
        timestamp: new Date(),
    });
});

/* ======================================================
   🏗️ PRODUCTION STATIC FRONTEND
====================================================== */

if (process.env.NODE_ENV === "production") {
    const frontendDistPath = path.resolve(__dirname, "../frontend/dist");
    app.use(express.static(frontendDistPath));

    // SPA fallback (all non-API routes -> frontend)
    app.get("*", (req, res, next) => {
        if (req.path.startsWith("/api")) return next();
        res.sendFile(path.join(frontendDistPath, "index.html"));
    });
}

/* ======================================================
   ❌ 404 HANDLER
====================================================== */

app.use("/api", (req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

/* ======================================================
   🛑 GLOBAL ERROR HANDLER
====================================================== */

app.use((err, req, res, next) => {
    console.error("🔥 Server Error:", err);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
});

/* ======================================================
   🚀 START SERVER
====================================================== */

const PORT = process.env.PORT || 5003;

const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🔗 Frontend allowed: ${process.env.FRONTEND_URL}`);
    console.log(`📝 Health check: http://localhost:${PORT}/api/health`);
});

/* ======================================================
   📴 GRACEFUL SHUTDOWN
====================================================== */

process.on("SIGTERM", () => {
    console.log("SIGTERM received. Shutting down gracefully...");
    server.close(() => {
        mongoose.connection.close(false, () => {
            console.log("MongoDB connection closed.");
            process.exit(0);
        });
    });
});
