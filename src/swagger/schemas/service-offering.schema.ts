/**
 * @swagger
 * components:
 *   schemas:
 *     ServiceOffering:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         title:
 *           type: string
 *           example: "Company Incorporation"
 *         description:
 *           type: string
 *           example: "Complete company registration and incorporation services including documentation."
 *         s3Key:
 *           type: string
 *           nullable: true
 *           example: "icons/company-inc.png"
 *         bucketName:
 *           type: string
 *           nullable: true
 *           example: "anycomp-assets"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateServiceOfferingRequest:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - specialistId
 *       properties:
 *         title:
 *           type: string
 *           minLength: 2
 *           maxLength: 255
 *           example: "New Service"
 *         description:
 *           type: string
 *           minLength: 10
 *           example: "Description of the new service offering."
 *         specialistId:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *           description: ID of the specialist to associate with this service offering
 *         s3Key:
 *           type: string
 *           example: "icons/new-service.png"
 *         bucketName:
 *           type: string
 *           example: "anycomp-assets"
 *
 *     UpdateServiceOfferingRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           minLength: 2
 *           maxLength: 255
 *         description:
 *           type: string
 *           minLength: 10
 *         s3Key:
 *           type: string
 *         bucketName:
 *           type: string
 */
