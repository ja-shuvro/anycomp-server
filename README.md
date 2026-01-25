# Anycomp Backend Server

A production-grade Node.js Express backend built with TypeScript and TypeORM for the Anycomp Specialist Management Platform.

## 🏗️ Architecture

This project follows a modular, layered architecture pattern:

```
/anycomp-server
├── /src
│   ├── /entities        # TypeORM database models
│   ├── /controllers     # Request/response handlers
│   ├── /routes          # Express route definitions
│   ├── /services        # Business logic layer
│   ├── /middleware      # Custom middleware (validation, error handling, security)
│   ├── /dto             # Data Transfer Objects for validation
│   ├── /utils           # Helper utilities (logger, response formatters)
│   ├── /errors          # Custom error classes
│   ├── /config          # Configuration files (Swagger, database)
│   ├── /swagger         # Swagger documentation (schemas, paths)
│   ├── /migrations      # Database migrations
│   ├── /seeds           # Database seed data
│   ├── data-source.ts   # TypeORM connection configuration
│   └── server.ts        # Application entry point
├── .env                 # Environment variables (gitignored)
├── .env.example         # Environment variables template
├── nodemon.json         # Nodemon configuration
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd /Users/ja.shuvro/workspace/project/backend/anycomp-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and update the database credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASS=your_password
   DB_NAME=anycomp_db
   APP_PORT=3000
   NODE_ENV=development
   ```

4. **Create PostgreSQL database**
   ```bash
   # Connect to PostgreSQL
   psql -U postgres
   
   # Create database
   CREATE DATABASE anycomp_db;
   ```

5. **Run migrations and seed data**
   ```bash
   npm run typeorm migration:run
   npm run seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server with hot reload (nodemon)
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run production server
- `npm run typeorm` - Run TypeORM CLI commands
- `npm run seed` - Seed database with initial data

## 📚 API Documentation

Interactive API documentation is available via Swagger UI:

**Swagger UI:** `http://localhost:3000/api-docs`

![Swagger Documentation](/Users/ja.shuvro/.gemini/antigravity/brain/c59f6b0c-47b5-4130-820f-37a5c6128a43/platform_fees_pagination_docs_1769322389187.png)

## 📡 API Endpoints

Base URL: `http://localhost:3000/api/v1`

### Health Check
- **GET** `/health` - Check server and database status

### Platform Fees
- **GET** `/platform-fees` - Get all platform fee tiers (with pagination)
  - Query params: `?page=1&limit=10`
- **GET** `/platform-fees/:id` - Get platform fee by ID
- **POST** `/platform-fees` - Create new platform fee tier
- **PATCH** `/platform-fees/:id` - Update platform fee tier
- **DELETE** `/platform-fees/:id` - Delete platform fee tier

### Example Requests

**Health Check:**
```bash
curl http://localhost:3000/api/v1/health
```

**Get Platform Fees (with pagination):**
```bash
curl "http://localhost:3000/api/v1/platform-fees?page=1&limit=10"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "tierName": "basic",
        "minValue": 0,
        "maxValue": 5000,
        "platformFeePercentage": 5.0,
        "createdAt": "2026-01-25T...",
        "updatedAt": "2026-01-25T..."
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 25,
      "itemsPerPage": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

**Create Platform Fee:**
```bash
curl -X POST http://localhost:3000/api/v1/platform-fees \
  -H "Content-Type: application/json" \
  -d '{
    "tierName": "premium",
    "minValue": 10000,
    "maxValue": 20000,
    "platformFeePercentage": 3.5
  }'
```

## 🛡️ Features

### ✅ Production-Ready Features

- **Swagger/OpenAPI Documentation** - Interactive API docs at `/api-docs`
- **Pagination Support** - All list endpoints support pagination with metadata
- **Request Validation** - Using `class-validator` decorators in DTOs
- **Global Error Handling** - Consistent error responses across all endpoints
- **Security Middleware** - Helmet, CORS, rate limiting
- **Request Logging** - HTTP request/response logging with Winston
- **Graceful Shutdown** - Proper cleanup on SIGTERM/SIGINT signals
- **TypeORM Integration** - Type-safe database operations
- **Environment-Based Config** - Secure configuration management

### Swagger Documentation Structure

Swagger documentation is separated from controller code for maintainability:

```
/src/swagger
├── index.ts              # Central export point
├── /schemas              # Reusable schema definitions
│   ├── platform-fee.schema.ts
│   └── health.schema.ts
└── /paths                # API endpoint documentation
    ├── platform-fee.docs.ts
    └── health.docs.ts
```

### Request Validation

All incoming requests are validated using `class-validator` decorators in DTO classes. Invalid requests return detailed error messages:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "statusCode": 400,
    "details": ["minValue must be less than maxValue"]
  }
}
```

### Response Format

All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "statusCode": 400,
    "timestamp": "2026-01-25T...",
    "path": "/api/v1/endpoint"
  }
}
```

## 🏛️ Project Structure Details

### Entities (`/src/entities`)
TypeORM models representing database tables. Use decorators like `@Entity`, `@Column`, `@PrimaryGeneratedColumn`.

### Controllers (`/src/controllers`)
Handle HTTP requests and responses. Extract data from requests, call services, and format responses. **Swagger documentation is separate** in `/src/swagger/paths`.

### Routes (`/src/routes`)
Define Express routes and apply middleware. Map HTTP methods to controller functions.

### Services (`/src/services`)
Business logic layer. Handle data processing, validation, and database operations.

### Middleware (`/src/middleware`)
Custom middleware for:
- Request validation (`validateRequest`)
- Error handling (`errorHandler`)
- Security (`securityMiddleware`)
- Rate limiting (`apiLimiter`)
- Request logging (`requestLogger`)

### DTOs (`/src/dto`)
Data Transfer Objects with validation rules using `class-validator` decorators.

### Swagger (`/src/swagger`)
Centralized API documentation separated from controller code:
- `schemas/` - Reusable schema definitions
- `paths/` - Endpoint documentation

## 🔧 Development Guidelines

### Adding a New Feature

1. **Create Entity** in `/src/entities`
2. **Create DTO** in `/src/dto` with validation rules
3. **Create Service** in `/src/services` with business logic
4. **Create Controller** in `/src/controllers` (clean, no Swagger comments)
5. **Create Swagger Docs** in `/src/swagger/paths` and `/src/swagger/schemas`
6. **Create Routes** in `/src/routes`
7. **Mount Routes** in `/src/routes/index.ts`
8. **Update swagger/index.ts** to import new documentation

### Error Handling

Use custom error classes from `/src/errors/custom-errors.ts`:

```typescript
throw new NotFoundError("Platform fee not found", "PLATFORM_FEE_NOT_FOUND");
throw new ValidationError("Invalid input", "VALIDATION_ERROR");
throw new ConflictError("Tier already exists", "TIER_EXISTS");
```

### Adding Swagger Documentation

1. Create schema in `/src/swagger/schemas/your-module.schema.ts`
2. Create path docs in `/src/swagger/paths/your-module.docs.ts`
3. Import both in `/src/swagger/index.ts`

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | PostgreSQL host | localhost |
| `DB_PORT` | PostgreSQL port | 5432 |
| `DB_USER` | Database username | postgres |
| `DB_PASS` | Database password | - |
| `DB_NAME` | Database name | anycomp_db |
| `APP_PORT` | Application port | 3000 |
| `NODE_ENV` | Environment mode | development |
| `CORS_ORIGIN` | CORS allowed origins | * |
| `LOG_LEVEL` | Winston log level | info |

## 🔍 Troubleshooting

### Port Already in Use

If you see "EADDRINUSE: address already in use :::3000":

```bash
# Kill processes on port 3000
lsof -ti:3000 | xargs kill -9

# Or kill all node processes
pkill -f "ts-node src/server.ts" && pkill -f nodemon
```

The server has graceful shutdown built-in. Press `Ctrl+C` once to shutdown cleanly.

### Nodemon Issues

- Type `rs` in the nodemon console to manually restart
- Nodemon has a 1-second delay before restart to prevent port conflicts

## 🤝 Contributing

1. Create feature branch
2. Make changes following the development guidelines
3. Test thoroughly
4. Update Swagger documentation
5. Submit pull request

## 📄 License

ISC

