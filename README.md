# Anycomp Server - Backend API

A comprehensive NestJS-style backend API for managing specialists, services, and media files. Built with Express, TypeORM, and PostgreSQL.

## 🚀 Features

- **Platform Fee Management** - Dynamic fee calculation with tiered pricing
- **Service Offerings** - Manage master list of available services
- **Specialist Profiles** - Complete CRUD with draft/publish workflow
- **Advanced Filtering & Sorting** - Search, filter by status/price/rating, sort by multiple criteria
- **Media Management** - File uploads with validation (images, videos, PDFs)
- **Soft Delete** - Data preservation with soft delete pattern
- **Health Monitoring** - Endpoint for system and database health checks
- **Swagger Documentation** - Interactive API documentation at `/api-docs`

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
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=anycomp_db

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
```

## 🏃 Running the Application

```bash
# Development mode with hot reload
npm run dev

# Production build
npm run build
npm start
```

The API will be available at `http://localhost:3000`

## 📚 API Documentation

Interactive Swagger documentation: `http://localhost:3000/api-docs`

### Core Endpoints

#### Platform Fees
```
GET    /api/v1/platform-fees              # List all fee tiers
POST   /api/v1/platform-fees              # Create fee tier
GET    /api/v1/platform-fees/:id          # Get fee tier
PATCH  /api/v1/platform-fees/:id          # Update fee tier
DELETE /api/v1/platform-fees/:id          # Delete fee tier
POST   /api/v1/platform-fees/calculate    # Calculate fee for amount
```

#### Service Offerings
```
GET    /api/v1/service-offerings           # List all services
POST   /api/v1/service-offerings           # Create service
GET    /api/v1/service-offerings/:id       # Get service
PATCH  /api/v1/service-offerings/:id       # Update service
DELETE /api/v1/service-offerings/:id       # Delete service
```

#### Specialists
```
GET    /api/v1/specialists                 # List specialists (with filters)
POST   /api/v1/specialists                 # Create specialist
GET    /api/v1/specialists/:id             # Get specialist
PATCH  /api/v1/specialists/:id             # Update specialist
DELETE /api/v1/specialists/:id             # Delete specialist (soft)
PATCH  /api/v1/specialists/:id/publish     # Publish specialist
```

**Specialist Filters & Sorting:**
```
?search=keyword              # Search in title/description
?status=verified             # Filter by status (pending/verified/rejected)
?isDraft=false               # Filter by draft status
?minPrice=1000&maxPrice=5000 # Filter by price range
?minRating=4.0               # Filter by minimum rating
?sortBy=price                # Sort by: price, rating, alphabetical, newest
?sortOrder=desc              # Sort order: asc, desc
?page=1&limit=10             # Pagination
```

#### Media
```
POST   /api/v1/media/upload                      # Upload file (multipart/form-data)
DELETE /api/v1/media/:id                         # Delete media
GET    /api/v1/media/specialist/:specialistId    # List specialist media
PATCH  /api/v1/media/:id/reorder                 # Update display order
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

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Test coverage
npm run test:cov
```

## 🚢 Deployment

### Production Build

```bash
npm run build
NODE_ENV=production node dist/server.js
```

### Environment Variables (Production)

```env
NODE_ENV=production
APP_PORT=3000
DB_HOST=production-db-host
DB_SSL=true
LOG_LEVEL=warn
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
