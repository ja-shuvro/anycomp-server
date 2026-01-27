# API Usage Guide

Complete guide to using the Anycomp Server API.

## Base URL

```
https://anycomp-server.vercel.app/api/v1
```

## Authentication

### Register User

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "SPECIALIST" 
}
```
*Note: `role` can be `ADMIN` or `SPECIALIST`.*

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "email": "user@example.com",
    "role": "SPECIALIST",
    "createdAt": "2026-01-26T10:00:00.000Z"
  },
  "message": "User registered successfully"
}
```

### Login

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "jwt.token.here",
    "user": {
      "id": "user-uuid",
      "email": "user@example.com",
      "role": "SPECIALIST",
      "createdAt": "2026-01-26T10:00:00.000Z"
    }
  },
  "message": "Login successful"
}
```

### Get Current User (Me)

**Endpoint:** `GET /auth/me`

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "email": "user@example.com",
    "role": "SPECIALIST",
    "createdAt": "2026-01-26T10:00:00.000Z"
  }
}
```

---

## Specialists API

### Create Specialist (Authenticated)

**Endpoint:** `POST /specialists`

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Professional Accountant",
  "description": "Expert in tax filing and financial planning",
  "basePrice": 5000,
  "durationDays": 7,
  "slug": "professional-accountant",
  "serviceIds": ["service-uuid-1", "service-uuid-2"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "specialist-uuid",
    "title": "Professional Accountant",
    "slug": "professional-accountant",
    "isDraft": true,
    "verificationStatus": "pending",
    "platformFee": 425.00,
    "finalPrice": 5425.00,
    ...
  }
}
```

### List Specialists

**Endpoint:** `GET /specialists`

**Query Parameters:**
- `search`: Search term for title/description
- `status`: `pending`, `verified`, `rejected`
- `isDraft`: `true`, `false`
- `minPrice`: Filter by minimum base price
- `maxPrice`: Filter by maximum base price
- `minRating`: Filter by minimum average rating
- `sortBy`: `price`, `rating`, `newest`, `alphabetical`
- `sortOrder`: `asc`, `desc` (default: `desc`)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
        {
            "id": "specialist-uuid",
            "title": "Accountant",
            "basePrice": 5000,
            ...
        }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 48,
      "itemsPerPage": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

### Get Specialist by ID

**Endpoint:** `GET /specialists/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "specialist-uuid",
    "title": "Professional Accountant",
    ...
    "serviceOfferings": [ ... ]
  }
}
```

### Update Specialist (Owner/Admin)

**Endpoint:** `PATCH /specialists/:id`

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Updated Title",
  "basePrice": 6000
}
```

**Response:**
```json
{
  "success": true,
  "data": { ... } // Updated specialist object
}
```

### Publish Specialist (Owner/Admin)

**Endpoint:** `PATCH /specialists/:id/publish`

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "specialist-uuid",
    "isDraft": false,
    ...
  },
  "message": "Specialist published successfully"
}
```

### Delete Specialist (Owner/Admin)

**Endpoint:** `DELETE /specialists/:id`

**Headers:**
- `Authorization: Bearer <token>`

**Response:** `204 No Content`

---

## Media API

### Upload File (Authenticated)

**Endpoint:** `POST /media/upload`

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Fields:**
- `file` (required): File to upload
- `specialistId` (required): UUID of the specialist
- `displayOrder` (optional): Integer

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "media-uuid",
    "fileName": "file.png",
    "publicUrl": "/uploads/file.png",
    ...
  }
}
```

### List Media for Specialist

**Endpoint:** `GET /media/specialist/:specialistId`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "media-uuid",
      "publicUrl": "/uploads/file.png",
      "displayOrder": 0
    }
  ]
}
```

### Reorder Media (Owner Only)

**Endpoint:** `PATCH /media/:id/reorder`

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "displayOrder": 2
}
```

**Response:**
```json
{
  "success": true,
  "data": { ... } // Updated media object
}
```

### Delete Media (Owner Only)

**Endpoint:** `DELETE /media/:id`

**Headers:**
- `Authorization: Bearer <token>`

**Response:** `204 No Content`

---

## Service Offerings API (Admin Only)

### List All Services

**Endpoint:** `GET /service-offerings`

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
        {
          "id": "uuid",
          "title": "Tax Filing",
          "serviceId": "service_001"
        }
    ],
    "pagination": { ... }
  }
}
```

### Create Service

**Endpoint:** `POST /service-offerings`

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Legal Consultation",
  "description": "Professional legal advice",
  "serviceId": "service_010",
  "s3Key": "icons/legal.png",
  "bucketName": "anycomp-assets"
}
```

**Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

### Get Service by ID

**Endpoint:** `GET /service-offerings/:id`

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

### Update Service

**Endpoint:** `PATCH /service-offerings/:id`

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description"
}
```

**Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

### Delete Service

**Endpoint:** `DELETE /service-offerings/:id`

**Headers:**
- `Authorization: Bearer <token>`

**Response:** `204 No Content`

---

## Platform Fees API (Admin Only)

### List Fee Tiers

**Endpoint:** `GET /platform-fees`

**Headers:**
- `Authorization: Bearer <token>`

**Query Parameters:**
- `page`: Page number
- `limit`: Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "tierName": "Basic",
        "minValue": 0,
        "maxValue": 5000,
        "platformFeePercentage": 5.0
      }
    ],
    "pagination": { ... }
  }
}
```

### Create Fee Tier

**Endpoint:** `POST /platform-fees`

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "tierName": "premium",
  "minValue": 15000,
  "maxValue": 50000,
  "platformFeePercentage": 4.5
}
```

**Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

### Get Fee Tier by ID

**Endpoint:** `GET /platform-fees/:id`

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

### Update Fee Tier

**Endpoint:** `PATCH /platform-fees/:id`

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "minValue": 20000,
  "platformFeePercentage": 4.0
}
```

**Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

### Delete Fee Tier

**Endpoint:** `DELETE /platform-fees/:id`

**Headers:**
- `Authorization: Bearer <token>`

**Response:** `204 No Content`

---

## Health Check API

### Check System Health

**Endpoint:** `GET /health`

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2026-01-26T10:00:00.000Z",
    "uptime": 2271.98,
    "database": "connected"
  }
}
```

---

## Error Codes

| Code | HTTP Status | Description |
|------|------------|-------------|
| `BAD_REQUEST` | 400 | Invalid request parameters |
| `VALIDATION_ERROR` | 400 | DTO validation failed |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource conflict (e.g., duplicate) |
| `INTERNAL_SERVER_ERROR` | 500 | Server error |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |

---

## Interactive API Documentation

For a more interactive experience, visit the Swagger UI:

**URL:** `https://anycomp-server.vercel.app/api-docs`

Features:
- Try out endpoints directly in the browser
- See request/response examples
- View schema definitions
- Test authentication
