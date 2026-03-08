import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Course from "../models/Course.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

const args = process.argv.slice(2);
const isApply = args.includes("--apply");

const fallbackArgIndex = args.indexOf("--fallback");
const fallbackRaw = fallbackArgIndex >= 0 ? args[fallbackArgIndex + 1] : "0";
const fallbackValue = Number(fallbackRaw);

if (!Number.isFinite(fallbackValue) || fallbackValue < 0 || fallbackValue > 100) {
    console.error("Invalid --fallback value. Use a number between 0 and 100.");
    process.exit(1);
}

const clampDiscount = (value) => Math.min(100, Math.max(0, Number(value)));

const shouldBackfill = (value) => value === undefined || value === null || !Number.isFinite(Number(value));

const run = async () => {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        throw new Error("MONGODB_URI is not configured.");
    }

    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });

    const courses = await Course.find({}, "_id title discount").lean();
    const updates = [];

    for (const course of courses) {
        const current = course.discount;
        let next = null;

        if (shouldBackfill(current)) {
            next = fallbackValue;
        } else {
            const clamped = clampDiscount(current);
            if (clamped !== Number(current)) {
                next = clamped;
            }
        }

        if (next !== null) {
            updates.push({
                updateOne: {
                    filter: { _id: course._id },
                    update: { $set: { discount: next } },
                },
            });
        }
    }

    console.log(`Scanned courses: ${courses.length}`);
    console.log(`Courses needing discount fix: ${updates.length}`);

    if (!isApply) {
        console.log("Dry run only. Re-run with --apply to write changes.");
        await mongoose.disconnect();
        return;
    }

    if (!updates.length) {
        console.log("No updates required.");
        await mongoose.disconnect();
        return;
    }

    const result = await Course.bulkWrite(updates);
    console.log(`Applied updates: ${result.modifiedCount || 0}`);

    await mongoose.disconnect();
};

run()
    .then(() => {
        process.exit(0);
    })
    .catch(async (error) => {
        console.error("Discount migration failed:", error.message);
        try {
            await mongoose.disconnect();
        } catch {
            // ignore disconnect errors
        }
        process.exit(1);
    });
