import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import logger from "../utils/logger";

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
                    logger.error("Cloudinary upload error:", error);
                    reject(error);
                } else if (result) {
                    logger.info(`File uploaded to Cloudinary: ${result.public_id}`);
                    resolve(result);
                } else {
                    reject(new Error("Upload failed with no result"));
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
