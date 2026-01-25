/**
 * Swagger Schema Definitions for Health Check
 * These schemas are reusable across different endpoints
 */

export const HealthCheckSchema = {
    type: 'object',
    properties: {
        status: {
            type: 'string',
            example: 'ok',
            description: 'Overall health status'
        },
        timestamp: {
            type: 'string',
            format: 'date-time',
            description: 'Current server timestamp'
        },
        uptime: {
            type: 'number',
            description: 'Server uptime in seconds'
        },
        database: {
            type: 'string',
            enum: ['connected', 'disconnected'],
            example: 'connected',
            description: 'Database connection status'
        }
    }
};
