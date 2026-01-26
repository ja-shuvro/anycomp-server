/**
 * @swagger
 * tags:
 *   name: Media
 *   description: Media file management for specialists
 */

/**
 * @swagger
 * /media/upload:
 *   post:
 *     summary: Upload media file
 *     description: Upload an image, video, or document for a specialist profile
 *     tags: [Media]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - specialistId
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File to upload (max 5MB for images/docs, 10MB for videos)
 *               specialistId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the specialist
 *               displayOrder:
 *                 type: integer
 *                 minimum: 0
 *                 description: Display order (optional, auto-incremented if not provided)
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Media'
 *       400:
 *         description: Invalid file type or missing required fields
 *       404:
 *         description: Specialist not found
 *
 * /media/{id}:
 *   delete:
 *     summary: Delete media file
 *     description: Soft deletes the media record and removes the physical file
 *     tags: [Media]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Media deleted successfully
 *       404:
 *         description: Media not found
 *
 * /media/specialist/{specialistId}:
 *   get:
 *     summary: Get all media for a specialist
 *     description: Returns all media files associated with a specialist, ordered by display order
 *     tags: [Media]
 *     parameters:
 *       - in: path
 *         name: specialistId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of media files
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Media'
 *
 * /media/{id}/reorder:
 *   patch:
 *     summary: Update display order
 *     description: Change the display order of a media file
 *     tags: [Media]
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
 *             type: object
 *             required:
 *               - displayOrder
 *             properties:
 *               displayOrder:
 *                 type: integer
 *                 minimum: 0
 *     responses:
 *       200:
 *         description: Display order updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Media'
 *       404:
 *         description: Media not found
 */
