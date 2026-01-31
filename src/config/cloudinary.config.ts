import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import logger from "../utils/logger";

// Validate environment variables
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
    logger.error("Cloudinary configuration missing:", {
        hasCloudName: !!cloudName,
        hasApiKey: !!apiKey,
        hasApiSecret: !!apiSecret,
    });
    throw new Error("Cloudinary environment variables are not configured. Please check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.");
}

// Configure Cloudinary
cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
});

logger.info("Cloudinary configured successfully", { cloud_name: cloudName });

/**
 * Upload file buffer to Cloudinary
 * @param fileBuffer - File buffer from multer
 * @param folder - Cloudinary folder name (default: 'anycomp')
 * @returns Upload result with secure_url and public_id
 */
export const uploadToCloudinary = (
    fileBuffer: Buffer,
    folder: string = "anycomp"
): Promise<UploadApiResponse> => {
    return new Promise((resolve, reject) => {
        // Validate buffer
        if (!fileBuffer || fileBuffer.length === 0) {
            const error = new Error("File buffer is empty or undefined");
            logger.error("Cloudinary upload validation failed:", error);
            reject(error);
            return;
        }

        logger.info("Starting Cloudinary upload...", {
            folder,
            bufferSize: fileBuffer.length,
        });

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folder,
                resource_type: "auto",
                transformation: [
                    { quality: "auto" },
                    { fetch_format: "auto" },
                ],
            },
            (error, result) => {
                if (error) {
                    logger.error("Cloudinary upload error:", {
                        message: error.message,
                        error: error,
                        http_code: error.http_code,
                    });
                    reject(error);
                } else if (result) {
                    logger.info(`File uploaded to Cloudinary: ${result.public_id}`);
                    resolve(result);
                } else {
                    const err = new Error("Upload failed with no result");
                    logger.error("Cloudinary upload failed:", err);
                    reject(err);
                }
            }
        );

        uploadStream.end(fileBuffer);
    });
};

/**
 * Delete file from Cloudinary
 * @param publicId - Cloudinary public_id
 * @returns Deletion result
 */
export const deleteFromCloudinary = async (publicId: string): Promise<any> => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        logger.info(`File deleted from Cloudinary: ${publicId}`, result);
        return result;
    } catch (error) {
        logger.error("Cloudinary deletion error:", error);
        throw error;
    }
};

export default cloudinary;
