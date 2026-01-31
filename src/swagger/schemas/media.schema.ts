/**
 * @swagger
 * components:
 *   schemas:
 *     Media:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         specialists:
 *           type: string
 *           format: uuid
 *           nullable: true
 *         fileName:
 *           type: string
 *           description: Cloudinary public_id (used for file deletion)
 *         fileSize:
 *           type: integer
 *         displayOrder:
 *           type: integer
 *         mimeType:
 *           type: string
 *           enum: [image/jpeg, image/png, image/webp, video/mp4, application/pdf]
 *         mediaType:
 *           type: string
 *           enum: [image, video, document]
 *         uploadedAt:
 *           type: string
 *           format: date-time
 *         publicUrl:
 *           type: string
 *           description: Cloudinary CDN URL
 *           example: https://res.cloudinary.com/your-cloud/image/upload/v123456/anycomp/media/abc123.jpg
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
