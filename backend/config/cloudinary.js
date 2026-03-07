import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


// Upload file to Cloudinary
export const uploadToCloudinary = async (
    fileBuffer,
    fileName,
    folder = "pib-bits",
    options = {}
) => {
    try {
        return new Promise((resolve, reject) => {

            // 🔥 Detect file type from extension
            const isPdf = fileName.toLowerCase().endsWith(".pdf");
            const resourceType = options.resourceType || (isPdf ? "raw" : "image");

            const upload = cloudinary.uploader.upload_stream(
                {
                    folder,
                    resource_type: resourceType,
                    public_id: fileName,
                    overwrite: true,
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );

            upload.end(fileBuffer);
        });
    } catch (error) {
        throw error;
    }
};

// Delete file from Cloudinary
export const deleteFromCloudinary = async (publicId, isPdf = false) => {
    try {
        return await cloudinary.uploader.destroy(publicId, {
            resource_type: isPdf ? "raw" : "image",
        });
    } catch (error) {
        throw error;
    }
};
export default cloudinary;
