
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { clerkMiddleware } from "@clerk/express";
import path from "path";
import { fileURLToPath } from "url";
import * as Sentry from "@sentry/node";
import { requestContext } from "./middleware/requestContext.js";
import { httpLogger, logger } from "./config/logger.js";

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
if (process.env.NODE_ENV !== "test") {
    dotenv.config({ path: path.join(__dirname, ".env") });
}

// Import routes
import courseRoutes from "./routes/courseRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";

const app = express();
const appStartTime = Date.now();

if (process.env.SENTRY_DSN) {
    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        environment: process.env.NODE_ENV || "development",
        tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE || 0.1),
    });
}

/* ======================================================
   🔐 SECURITY MIDDLEWARE
====================================================== */

// Helmet with CSP tuned for Clerk + Cloudinary in production
app.use(
    helmet({
        contentSecurityPolicy: {
            useDefaults: true,
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: [
                    "'self'",
                    "'unsafe-inline'",
                    "https://*.clerk.com",
                    "https://*.clerk.accounts.dev",
                    "https://sdk.cashfree.com",
                    "https://cdn.jsdelivr.net",
                    "https://unpkg.com",
                ],
                scriptSrcElem: [
                    "'self'",
                    "'unsafe-inline'",
                    "https://*.clerk.com",
                    "https://*.clerk.accounts.dev",
                    "https://sdk.cashfree.com",
                    "https://cdn.jsdelivr.net",
                    "https://unpkg.com",
                ],
                styleSrc: [
                    "'self'",
                    "'unsafe-inline'",
                    "https://fonts.googleapis.com",
                ],
                styleSrcElem: [
                    "'self'",
                    "'unsafe-inline'",
                    "https://fonts.googleapis.com",
                ],
                imgSrc: [
                    "'self'",
                    "data:",
                    "blob:",
                    "https://*.clerk.com",
                    "https://*.clerk.accounts.dev",
                    "https://res.cloudinary.com",
                ],
                connectSrc: [
                    "'self'",
                    "https://*.clerk.com",
                    "https://*.clerk.accounts.dev",
                    "https://api.clerk.com",
                    "https://clerk-telemetry.com",
                    "https://*.cashfree.com",
                    "https://sdk.cashfree.com",
                    "https://sandbox.cashfree.com",
                    "https://api.cashfree.com",
                    "https://payments.cashfree.com",
                ],
                frameSrc: [
                    "'self'",
                    "https://*.clerk.com",
                    "https://*.clerk.accounts.dev",
                    "https://*.cashfree.com",
                    "https://sandbox.cashfree.com",
                    "https://payments.cashfree.com",
                ],
                workerSrc: [
                    "'self'",
                    "blob:",
                    "https://*.clerk.com",
                    "https://*.clerk.accounts.dev",
                ],
                formAction: [
                    "'self'",
                    "https://*.cashfree.com",
                    "https://sandbox.cashfree.com",
                    "https://payments.cashfree.com",
                ],
                fontSrc: ["'self'", "data:", "https://fonts.gstatic.com"],
                objectSrc: ["'none'"],
            },
        },
    })
);

app.use(requestContext);
app.use(httpLogger);

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

/* ======================================================
   🗄️ DATABASE CONNECTION
====================================================== */

if (process.env.MONGODB_URI) {
    mongoose
        .connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        })
        .then(() => {
            logger.info("MongoDB connected successfully");
        })
        .catch((err) => {
            logger.error({ err: err.message }, "MongoDB connection error");
            if (process.env.NODE_ENV !== "test") {
                process.exit(1);
            }
        });
} else {
    logger.warn("MONGODB_URI is not configured; database-dependent routes may fail.");
}

/* ======================================================
   📌 API ROUTES
====================================================== */

app.use("/api/courses", courseRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/wishlist", wishlistRoutes);

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
        uptimeSeconds: Math.floor((Date.now() - appStartTime) / 1000),
        memory: process.memoryUsage(),
        environment: process.env.NODE_ENV || "development",
        timestamp: new Date(),
        requestId: req.id,
    });
});

app.get("/api/ready", (req, res) => {
    const dbConnected = mongoose.connection.readyState === 1;
    if (!dbConnected) {
        return res.status(503).json({
            status: "not_ready",
            database: "Disconnected",
            requestId: req.id,
            timestamp: new Date(),
        });
    }

    return res.status(200).json({
        status: "ready",
        database: "Connected",
        requestId: req.id,
        timestamp: new Date(),
    });
});

/* ======================================================
   🏗️ PRODUCTION STATIC FRONTEND
====================================================== */

if (process.env.NODE_ENV === "production") {
    const frontendDistPath = path.resolve(__dirname, "../frontend/dist");

    // Cache hashed static assets aggressively, but always revalidate HTML shell.
    app.use(
        "/assets",
        express.static(path.join(frontendDistPath, "assets"), {
            maxAge: "1y",
            immutable: true,
        })
    );

    app.use(
        express.static(frontendDistPath, {
            maxAge: 0,
            setHeaders: (res, filePath) => {
                if (filePath.endsWith(".html")) {
                    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
                }
            },
        })
    );

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
    if (process.env.SENTRY_DSN) {
        Sentry.captureException(err, { tags: { requestId: req.id } });
    }
    logger.error({ err, requestId: req.id }, "Server error");

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
        requestId: req.id,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
});

/* ======================================================
   🚀 START SERVER
====================================================== */

const PORT = process.env.PORT || 5003;
let server = null;

export const startServer = () =>
    app.listen(PORT, () => {
        logger.info(`Server running on http://localhost:${PORT}`);
        logger.info(`Frontend allowed: ${process.env.FRONTEND_URL}`);
        logger.info(`Health check: http://localhost:${PORT}/api/health`);
    });

if (process.env.NODE_ENV !== "test") {
    server = startServer();
}

/* ======================================================
   📴 GRACEFUL SHUTDOWN
====================================================== */

process.on("SIGTERM", () => {
    logger.info("SIGTERM received. Shutting down gracefully...");
    if (!server) process.exit(0);
    server.close(() => {
        mongoose.connection.close(false, () => {
            logger.info("MongoDB connection closed.");
            process.exit(0);
        });
    });
});

export { app };
