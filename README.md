# Anycomp Server - Backend API

A comprehensive NestJS-style backend API for managing specialists, services, and media files. Built with Express, TypeORM, and PostgreSQL.

## 🚀 Features

- **JWT Authentication** - Secure access to protected resources
- **Role-Based Access Control (RBAC)** - Granular permissions for ADMIN and SPECIALIST roles
- **Data Ownership Enforcement** - Strict data isolation using ownership middleware
- **Platform Fee Management** - Dynamic fee calculation with tiered pricing
- **Service Offerings** - Manage master list of available services
- **Specialist Profiles** - Complete CRUD with draft/publish workflow
- **Advanced Filtering & Sorting** - Search, filter by status/price/rating, sort by multiple criteria
- **Media Management** - File uploads with validation (images, videos, PDFs)
- **Soft Delete** - Data preservation with soft delete pattern
- **Health Monitoring** - Endpoint for system and database health checks
- **Vercel Ready** - Optimized for serverless deployment

## 📋 Prerequisites

- Node.js >= 18.x
- PostgreSQL >= 14.x
- npm or yarn

## 🛠️ Installation

```bash
# Clone the repository
git clone <repository-url>
cd anycomp-server

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your database credentials
```

## ⚙️ Environment Configuration

Create a `.env` file in the root directory:

```env
# Application
APP_PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=your_password
DB_NAME=anycomp_db

# Security
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=*

# Logging
LOG_LEVEL=info
```

## 🗄️ Database Setup

```bash
# Run migrations
npm run migration:run

# Generate a new migration (after entity changes)
npm run migration:generate -- src/migrations/MigrationName

# Revert last migration
npm run migration:revert

# Seed data
npm run seed
```

## 🏃 Running the Application

```bash
# Development mode with hot reload
npm run dev

# Production build
npm run build
NODE_ENV=production npm start
```

> [!IMPORTANT]
> The server performs environment variable validation on startup. Ensure all variables in `.env.example` are present in your `.env` file for the application to run.

The API will be available at `http://localhost:3000`

## 📚 API Documentation

Interactive Swagger documentation: `http://localhost:3000/api-docs`

### Core Modules

#### Authentication
```
POST   /api/v1/auth/register       # Register new user
POST   /api/v1/auth/login          # Login and get token
GET    /api/v1/auth/me             # Get current user info (Auth)
```

#### Platform Fees (Admin Only)
```
GET    /api/v1/platform-fees              # List all fee tiers
POST   /api/v1/platform-fees              # Create fee tier
GET    /api/v1/platform-fees/:id          # Get fee tier
PATCH  /api/v1/platform-fees/:id          # Update fee tier
DELETE /api/v1/platform-fees/:id          # Delete fee tier
POST   /api/v1/platform-fees/calculate    # Calculate fee for amount
```

#### Service Offerings (Admin Only Mutations)
```
GET    /api/v1/service-offerings           # List all services
POST   /api/v1/service-offerings           # Create service
GET    /api/v1/service-offerings/:id       # Get service
PATCH  /api/v1/service-offerings/:id       # Update service
DELETE /api/v1/service-offerings/:id       # Delete service
```

#### Specialists
```
GET    /api/v1/specialists                 # List specialists (Public)
GET    /api/v1/specialists/:id             # Get specialist (Public)
POST   /api/v1/specialists                 # Create specialist (Auth)
PATCH  /api/v1/specialists/:id             # Update specialist (Owner/Admin)
DELETE /api/v1/specialists/:id             # Delete specialist (Owner/Admin)
PATCH  /api/v1/specialists/:id/publish     # Publish specialist (Owner/Admin)
```

#### Media
```
POST   /api/v1/media/upload                      # Upload file (Owner/Admin)
DELETE /api/v1/media/:id                         # Delete media (Owner/Admin)
GET    /api/v1/media/specialist/:specialistId    # List specialist media
PATCH  /api/v1/media/:id/reorder                 # Update order (Owner/Admin)
```

**Upload Example:**
```bash
curl -X POST http://localhost:3000/api/v1/media/upload \
  -F "file=@image.jpg" \
  -F "specialistId=uuid-here" \
  -F "displayOrder=1"
```

**Allowed File Types:**
- Images: JPEG, PNG, WebP (max 5MB)
- Videos: MP4 (max 10MB)
- Documents: PDF (max 5MB)

#### Health
```
GET /api/v1/health    # System health check
```

## 🏗️ Project Structure

```
src/
├── config/           # Configuration files (Swagger, upload)
├── controllers/      # Route controllers
├── dto/              # Data Transfer Objects with validation
├── entities/         # TypeORM entities
├── errors/           # Custom error classes
├── middleware/       # Express middleware
├── migrations/       # Database migrations
├── routes/           # API routes
├── services/         # Business logic layer
├── swagger/          # Swagger documentation
│   ├── paths/        # API path documentation
│   └── schemas/      # Schema definitions
└── utils/            # Utility functions
```

## 🔒 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "statusCode": 400,
    "timestamp": "2026-01-26T10:00:00.000Z",
    "path": "/api/v1/endpoint"
  }
}
```

**Common Error Codes:**
- `BAD_REQUEST` (400) - Invalid input
- `NOT_FOUND` (404) - Resource not found
- `VALIDATION_ERROR` (400) - DTO validation failed
- `INTERNAL_SERVER_ERROR` (500) - Server error

## 📝 Key Features in Detail

### Platform Fee Calculation

Tiered percentage-based fees:
```typescript
// Example: Base price 10,000
// Tier: 0-5000 (5%), 5001-10000 (7%)
// Calculation: (5000 * 0.05) + (5000 * 0.07) = 600
```

### Specialist Workflow

1. **Create** - Specialist created in draft mode (`isDraft: true`)
2. **Add Services** - Assign service offerings
3. **Upload Media** - Add images/videos/documents
4. **Publish** - Validate and set `isDraft: false`

**Publishing Requirements:**
- All required fields (title, description, price, duration)
- At least one service offering
- Status not "rejected"

### Media Management

- Files stored in `uploads/` directory
- Auto-generated unique filenames
- Soft delete removes DB record AND physical file
- Display order for galleries
- Public URL generation for access

## 🔒 Security

### Role-Based Access Control (RBAC)
- **ADMIN**: Full access to all modules, including platform fees and service master lists.
- **SPECIALIST**: Can manage their own profiles and associated media.
- **CLIENT/USER**: Public read access to verified specialist profiles.

### Data Ownership
Strict isolation is enforced via `ownershipMiddleware`. Users can only modify or delete specialist profiles and media they created.

### JWT Authentication
Protects all sensitive endpoints. Standard `Bearer <token>` in Authorization header.

## 🧪 Testing

Integration tests cover authentication, RBAC, ownership, and core CRUD logic.

```bash
# Run all integration tests
npm test tests/integration/api -- --runInBand

# Test coverage
npm run test:coverage
```

### Verification Results
- **38 Integration Tests**: All PASS
- **Security Coverage**: Auth, Roles, and Ownership fully validated.

## 🚢 Deployment (Vercel)

This project is optimized for Vercel Serverless Functions.

1.  **Preparation**:
    - Project includes `vercel.json` for routing.
    - `api/index.ts` serves as the serverless entry point.
2.  **Configuration**: Add all `.env` variables (including `JWT_SECRET`) to Vercel Project Settings.
3.  **CI/CD**: Connect GitHub repository for automated deployments.

### Production Environment Variables

```env
NODE_ENV=production
DB_HOST=your-db-host
DB_USER=your-user
DB_PASS=your-password
DB_NAME=your-db
JWT_SECRET=secure-production-secret
JWT_EXPIRES_IN=24h
```

### Docker (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production  
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

## 📄 License

MIT

## 👥 Contributors

- Development Team

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For issues and questions, please open an issue on GitHub.
