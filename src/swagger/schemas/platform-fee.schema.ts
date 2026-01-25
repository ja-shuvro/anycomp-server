/**
 * Swagger Schema Definitions for Platform Fee
 * These schemas are reusable across different endpoints
 */

export const PlatformFeeSchema = {
    type: 'object',
    properties: {
        id: {
            type: 'string',
            format: 'uuid',
            description: 'Platform fee unique identifier'
        },
        tier_name: {
            type: 'string',
            enum: ['basic', 'standard', 'premium', 'enterprise'],
            description: 'Fee tier name'
        },
        min_value: {
            type: 'integer',
            description: 'Minimum transaction value for this tier'
        },
        max_value: {
            type: 'integer',
            description: 'Maximum transaction value for this tier'
        },
        platform_fee_percentage: {
            type: 'number',
            format: 'float',
            description: 'Platform fee percentage for this tier'
        },
        created_at: {
            type: 'string',
            format: 'date-time',
            description: 'Creation timestamp'
        },
        updated_at: {
            type: 'string',
            format: 'date-time',
            description: 'Last update timestamp'
        }
    }
};

export const CreatePlatformFeeSchema = {
    type: 'object',
    required: ['tierName', 'minValue', 'maxValue', 'platformFeePercentage'],
    properties: {
        tierName: {
            type: 'string',
            enum: ['basic', 'standard', 'premium', 'enterprise'],
            example: 'premium'
        },
        minValue: {
            type: 'integer',
            minimum: 0,
            example: 15000
        },
        maxValue: {
            type: 'integer',
            minimum: 0,
            example: 50000
        },
        platformFeePercentage: {
            type: 'number',
            format: 'float',
            minimum: 0,
            maximum: 100,
            example: 4.5
        }
    }
};

export const UpdatePlatformFeeSchema = {
    type: 'object',
    properties: {
        minValue: {
            type: 'integer',
            minimum: 0
        },
        maxValue: {
            type: 'integer',
            minimum: 0
        },
        platformFeePercentage: {
            type: 'number',
            format: 'float',
            minimum: 0,
            maximum: 100
        }
    }
};

export const SuccessResponseSchema = {
    type: 'object',
    properties: {
        success: {
            type: 'boolean',
            example: true
        },
        data: {
            type: 'object',
            description: 'Response data'
        }
    }
};
