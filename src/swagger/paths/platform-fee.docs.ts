/**
 * Swagger Path Documentation for Platform Fee Endpoints
 * Centralized API documentation for all platform fee related routes
 */

/**
 * @swagger
 * tags:
 *   name: Platform Fees
 *   description: Platform fee management endpoints
 */

/**
 * @swagger
 * /platform-fees:
 *   get:
 *     summary: Get all platform fee tiers
 *     tags: [Platform Fees]
 *     description: Retrieve all platform fee tiers ordered by minimum value with pagination support
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Successfully retrieved platform fee tiers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                           tierName:
 *                             type: string
 *                             enum: [basic, standard, premium, enterprise]
 *                           minValue:
 *                             type: integer
 *                           maxValue:
 *                             type: integer
 *                           platformFeePercentage:
 *                             type: number
 *                             format: float
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                     pagination:
 *                       $ref: '#/components/schemas/PaginationMeta'
 */

/**
 * @swagger
 * /platform-fees/{id}:
 *   get:
 *     summary: Get platform fee by ID
 *     tags: [Platform Fees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Platform fee ID
 *     responses:
 *       200:
 *         description: Successfully retrieved platform fee
 *       404:
 *         description: Platform fee not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /platform-fees:
 *   post:
 *     summary: Create new platform fee tier
 *     tags: [Platform Fees]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tierName
 *               - minValue
 *               - maxValue
 *               - platformFeePercentage
 *             properties:
 *               tierName:
 *                 type: string
 *                 enum: [basic, standard, premium, enterprise]
 *                 example: premium
 *               minValue:
 *                 type: integer
 *                 minimum: 0
 *                 example: 15000
 *               maxValue:
 *                 type: integer
 *                 minimum: 0
 *                 example: 50000
 *               platformFeePercentage:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 maximum: 100
 *                 example: 4.5
 *     responses:
 *       201:
 *         description: Platform fee created successfully
 *       400:
 *         description: Invalid input data
 *       409:
 *         description: Tier name already exists or range overlaps
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /platform-fees/{id}:
 *   patch:
 *     summary: Update platform fee tier (partial)
 *     tags: [Platform Fees]
 *     description: Partially update an existing platform fee tier. Only provided fields will be updated.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Platform fee ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               minValue:
 *                 type: integer
 *                 minimum: 0
 *               maxValue:
 *                 type: integer
 *                 minimum: 0
 *               platformFeePercentage:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 maximum: 100
 *     responses:
 *       200:
 *         description: Platform fee updated successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Platform fee not found
 *       409:
 *         description: Range overlaps with existing tier
 *   delete:
 *     summary: Delete platform fee tier
 *     tags: [Platform Fees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Platform fee ID
 *     responses:
 *       204:
 *         description: Platform fee deleted successfully
 *       404:
 *         description: Platform fee not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
