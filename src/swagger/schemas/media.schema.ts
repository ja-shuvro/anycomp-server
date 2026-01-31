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
 *           nullable: true
 *         s3Key:
 *           type: string
 *           nullable: true
 *         bucketName:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
