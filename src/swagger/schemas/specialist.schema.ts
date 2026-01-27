/**
 * @swagger
 * components:
 *   schemas:
 *     Specialist:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         slug:
 *           type: string
 *         description:
 *           type: string
 *         basePrice:
 *           type: number
 *           format: float
 *         platformFee:
 *           type: number
 *           format: float
 *         finalPrice:
 *           type: number
 *           format: float
 *         averageRating:
 *           type: number
 *         totalNumberOfRatings:
 *           type: integer
 *         isDraft:
 *           type: boolean
 *         verificationStatus:
 *           type: string
 *           enum: [pending, verified, rejected]
 *         isVerified:
 *           type: boolean
 *         durationDays:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         userId:
 *           type: string
 *           format: uuid
 *           description: ID of the owner user
 *         serviceOfferings:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               serviceOfferingsMasterList:
 *                 $ref: '#/components/schemas/ServiceOffering'
 *
 *     CreateSpecialistRequest:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - basePrice
 *         - durationDays
 *       properties:
 *         title:
 *           type: string
 *           minLength: 2
 *         description:
 *           type: string
 *           minLength: 10
 *         basePrice:
 *           type: number
 *           minimum: 0.01
 *         durationDays:
 *           type: integer
 *           minimum: 1
 *         slug:
 *           type: string
 *         serviceIds:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *
 *     UpdateSpecialistRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         basePrice:
 *           type: number
 *         isDraft:
 *           type: boolean
 *         verificationStatus:
 *           type: string
 *           enum: [pending, verified, rejected]
 */
