/**
 * Swagger Documentation Index
 * 
 * This file imports and exports all swagger documentation files.
 * Import this in your swagger configuration to load all API documentation.
 * 
 * Usage:
 * import './swagger';
 */

// Import all swagger path documentation
import './paths/platform-fee.docs';
import './paths/health.docs';

// Export schemas for programmatic use
export * from './schemas/platform-fee.schema';
export * from './schemas/health.schema';
