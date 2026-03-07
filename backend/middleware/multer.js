import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file.fieldname === "pdf") {
        if (file.mimetype !== "application/pdf") {
            return cb(new Error("Only PDF files are allowed"), false);
        }
    }

    if (file.fieldname === "cover") {
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("Cover must be an image"), false);
        }
    }

    cb(null, true);
};

const upload = multer({
    storage,
    limits: {
        fileSize: 25 * 1024 * 1024, // 25MB
    },
    fileFilter,
});

export default upload;