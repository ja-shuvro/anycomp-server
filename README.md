# Anycomp Backend Server

A standalone Node.js Express backend built with TypeScript and TypeORM for the Anycomp replica project.

## 🏗️ Architecture

This project follows a modular architecture pattern:

```
/anycomp-server
├── /src
│   ├── /entities        # TypeORM database models
│   ├── /controllers     # Request/response handlers
│   ├── /routes          # Express route definitions
│   ├── /services        # Business logic layer
│   ├── /middleware      # Custom middleware (validation, error handling)
│   ├── /dto             # Data Transfer Objects for validation
│   ├── data-source.ts   # TypeORM connection configuration
│   └── server.ts        # Application entry point
├── .env                 # Environment variables (gitignored)
├── .env.example         # Environment variables template
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

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run production server
- `npm run typeorm` - Run TypeORM CLI commands

## 📡 API Endpoints

### Health Check
- **GET** `/api/health` - Check server status

### Users
- **POST** `/api/users` - Create a new user
- **GET** `/api/users` - Get all users
- **GET** `/api/users/:id` - Get user by ID
- **PUT** `/api/users/:id` - Update user
- **DELETE** `/api/users/:id` - Delete user

### Example Requests

**Create User:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "name": "John Doe"
  }'
```

**Get All Users:**
```bash
curl http://localhost:3000/api/users
```

## 🛡️ Features

### Request Validation
All incoming requests are validated using `class-validator` decorators in DTO classes. Invalid requests return detailed error messages.

### Global Error Handling
Centralized error handling middleware catches all errors and returns consistent JSON responses:
```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

### TypeORM Integration
- Automatic entity synchronization in development
- Migration support for production
- Repository pattern for database operations

### Environment-Based Configuration
All sensitive data and configuration is managed through environment variables.

## 🏛️ Project Structure Details

### Entities (`/src/entities`)
TypeORM models representing database tables. Use decorators like `@Entity`, `@Column`, `@PrimaryGeneratedColumn`.

### Controllers (`/src/controllers`)
Handle HTTP requests and responses. Extract data from requests, call services, and format responses.

### Routes (`/src/routes`)
Define Express routes and apply middleware. Map HTTP methods to controller functions.

### Services (`/src/services`)
Business logic layer. Handle data processing, validation, and database operations.

### Middleware (`/src/middleware`)
Custom middleware for:
- Request validation (`validateRequest`)
- Error handling (`errorHandler`)

### DTOs (`/src/dto`)
Data Transfer Objects with validation rules using `class-validator` decorators.

## 🔧 Development Guidelines

### Adding a New Feature

1. **Create Entity** in `/src/entities`
2. **Create DTO** in `/src/dto` with validation rules
3. **Create Service** in `/src/services` with business logic
4. **Create Controller** in `/src/controllers`
5. **Create Routes** in `/src/routes`
6. **Mount Routes** in `/src/routes/index.ts`

### Error Handling

Use the `AppError` class for operational errors:
```typescript
throw new AppError("Resource not found", 404);
```

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

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## 📄 License

ISC
