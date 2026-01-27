/**
 * @swagger
 * tags:
 *   name: Specialists
 *   description: Specialist profile management
 */

/**
 * @swagger
 * /specialists:
 *   get:
 *     summary: Get all specialists (filtered)
 *     tags: [Specialists]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by title or description
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, verified, rejected]
 *       - in: query
 *         name: isDraft
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [price, rating, newest, alphabetical]
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: List of specialists
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/PaginatedResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Specialist'
 *
 *   post:
 *     summary: Create new specialist (Authenticated)
 *     description: Create a new specialist profile. Requires SPECIALIST or ADMIN role.
 *     tags: [Specialists]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSpecialistRequest'
 *     responses:
 *       201:
 *         description: Created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Specialist'
 *
 * /specialists/{id}:
 *   get:
 *     summary: Get specialist by ID
 *     tags: [Specialists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Specialist details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Specialist'
 *       404:
 *         description: Not found
 *
 *   patch:
 *     summary: Update specialist (Owner Only)
 *     description: Update specialist profile details. Requires ownership or ADMIN role.
 *     tags: [Specialists]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateSpecialistRequest'
 *     responses:
 *       200:
 *         description: Updated successfully
 *
 * /specialists/{id}/publish:
 *   patch:
 *     summary: Publish specialist (Owner Only)
 *     description: Transitions a specialist from draft to published status. Requires ownership or ADMIN role. Validates all required fields and at least one service.
 *     tags: [Specialists]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Published successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Specialist'
 *       400:
 *         description: Validation failed (already published, missing services, rejected status, etc.)
 *       404:
 *         description: Specialist not found
 *
 *   delete:
 *     summary: Delete specialist (Owner Only)
 *     description: Soft delete specialist profile. Requires ownership or ADMIN role.
 *     tags: [Specialists]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Deleted successfully
 */
