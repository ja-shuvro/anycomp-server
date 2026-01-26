# API Usage Guide

Complete guide to using the Anycomp Server API.

## Base URL

```
http://localhost:3000/api/v1
```

## Authentication

*Currently, the API does not require authentication. This will be added in future versions.*

## Response Format

All API responses follow a consistent structure:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "statusCode": 400,
    "timestamp": "2026-01-26T10:00:00.000Z",
    "path": "/api/v1/endpoint"
  }
}
```

---

## Specialists API

### Create Specialist

**Endpoint:** `POST /specialists`

**Request Body:**
```json
{
  "title": "Professional Accountant",
  "description": "Expert in tax filing and financial planning",
  "basePrice": 5000,
  "durationDays": 7,
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
    "platformFee": "425.00",
    "finalPrice": "5425.00",
    ...
  }
}
```

### List Specialists with Filters

**Endpoint:** `GET /specialists`

**Query Parameters:**
- `search` - Search in title/description
- `status` - Filter by verification status (`pending`, `verified`, `rejected`)
- `isDraft` - Filter by draft status (`true`, `false`)
- `minPrice` / `maxPrice` - Price range filter
- `minRating` - Minimum rating filter
- `sortBy` - Sort field (`price`, `rating`, `alphabetical`, `newest`)
- `sortOrder` - Sort direction (`asc`, `desc`)
- `page` / `limit` - Pagination

**Examples:**

```bash
# Get published specialists
GET /specialists?isDraft=false

# Search and filter by price
GET /specialists?search=accountant&minPrice=3000&maxPrice=10000

# Sort by rating (highest first)
GET /specialists?sortBy=rating&sortOrder=desc

# Pagination
GET /specialists?page=2&limit=20
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [ ... ],
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

### Publish Specialist

**Endpoint:** `PATCH /specialists/:id/publish`

**Requirements:**
- All required fields must be filled
- At least one service offering
- Not in "rejected" status
- Currently in draft mode

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

**Error Cases:**
```json
{
  "error": {
    "message": "Specialist must have at least one service to be published"
  }
}
```

---

## Media API

### Upload File

**Endpoint:** `POST /media/upload`

**Content-Type:** `multipart/form-data`

**Form Fields:**
- `file` (required) - The file to upload
- `specialistId` (required) - UUID of the specialist
- `displayOrder` (optional) - Integer for ordering (auto-incremented if not provided)

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/v1/media/upload \
  -F "file=@/path/to/image.jpg" \
  -F "specialistId=uuid-here" \
  -F "displayOrder=0"
```

**JavaScript Example:**
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('specialistId', 'specialist-uuid');
formData.append('displayOrder', '0');

fetch('http://localhost:3000/api/v1/media/upload', {
  method: 'POST',
  body: formData
})
.then(res => res.json())
.then(data => console.log(data));
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "media-uuid",
    "specialists": "specialist-uuid",
    "fileName": "1769416568637-882061989.png",
    "fileSize": 1024567,
    "displayOrder": 0,
    "mimeType": "image/png",
    "mediaType": "image",
    "publicUrl": "/uploads/1769416568637-882061989.png",
    "uploadedAt": "2026-01-26T10:00:00.000Z"
  },
  "message": "Media uploaded successfully"
}
```

**Allowed File Types:**
- **Images:** `.jpg`, `.jpeg`, `.png`, `.webp` (max 5MB)
- **Videos:** `.mp4` (max 10MB)
- **Documents:** `.pdf` (max 5MB)

### List Media for Specialist

**Endpoint:** `GET /media/specialist/:specialistId`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "media-uuid-1",
      "fileName": "image1.jpg",
      "displayOrder": 0,
      "publicUrl": "/uploads/image1.jpg"
    },
    {
      "id": "media-uuid-2",
      "fileName": "image2.jpg",
      "displayOrder": 1,
      "publicUrl": "/uploads/image2.jpg"
    }
  ]
}
```

### Delete Media

**Endpoint:** `DELETE /media/:id`

**Response:** `204 No Content`

*Note: This performs a soft delete and also removes the physical file.*

---

## Platform Fees API

### Calculate Fee

**Endpoint:** `POST /platform-fees/calculate`

**Request Body:**
```json
{
  "amount": 12000
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "baseAmount": 12000,
    "platformFee": 800,
    "finalAmount": 12800,
    "breakdown": [
      {
        "tier": "Tier 1 (0-5000)",
        "amount": 5000,
        "percentage": 5,
        "fee": 250
      },
      {
        "tier": "Tier 2 (5001-10000)",
        "amount": 5000,
        "percentage": 7,
        "fee": 350
      },
      {
        "tier": "Tier 3 (10001-20000)",
        "amount": 2000,
        "percentage": 10,
        "fee": 200
      }
    ]
  }
}
```

### List Fee Tiers

**Endpoint:** `GET /platform-fees`

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

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

---

##Service Offerings API

### List All Services

**Endpoint:** `GET /service-offerings`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Tax Filing",
      "description": "Complete tax preparation and filing services",
      "serviceId": "service_001"
    }
  ]
}
```

### Create Service

**Endpoint:** `POST /service-offerings`

**Request Body:**
```json
{
  "title": "Legal Consultation",
  "description": "Professional legal advice",
  "serviceId": "service_010"
}
```

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

**Use Cases:**
- Load balancer health checks
- Monitoring systems
- Debugging connection issues

---

## Error Codes

| Code | HTTP Status | Description |
|------|------------|-------------|
| `BAD_REQUEST` | 400 | Invalid request parameters |
| `VALIDATION_ERROR` | 400 | DTO validation failed |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource conflict (e.g., duplicate) |
| `INTERNAL_SERVER_ERROR` | 500 | Server error |

---

## Pagination

All list endpoints support pagination:

**Query Parameters:**
- `page` - Page number (starts at 1)
- `limit` - Items per page (default: 10, max: 100)

**Pagination Metadata:**
```json
{
  "pagination": {
    "currentPage": 2,
    "totalPages": 10,
    "totalItems": 95,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": true
  }
}
```

---

## Rate Limiting

The API implements rate limiting to prevent abuse:
- **Limit:** 100 requests per 15 minutes per IP
- **Response on limit exceeded:** `429 Too Many Requests`

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests, please try again later"
  }
}
```

---

## Testing with cURL

```bash
# Health check
curl http://localhost:3000/api/v1/health

# List specialists
curl "http://localhost:3000/api/v1/specialists?page=1&limit=5"

# Create specialist
curl -X POST http://localhost:3000/api/v1/specialists \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","description":"Test desc","basePrice":1000,"durationDays":5}'

# Upload image
curl -X POST http://localhost:3000/api/v1/media/upload \
  -F "file=@image.jpg" \
  -F "specialistId=uuid-here"
```

---

## Interactive API Documentation

For a more interactive experience, visit the Swagger UI:

**URL:** `http://localhost:3000/api-docs`

Features:
- Try out endpoints directly in the browser
- See request/response examples
- View schema definitions
- Test authentication (when implemented)
