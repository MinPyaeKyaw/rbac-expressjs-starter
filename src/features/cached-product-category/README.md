# Cached Product Category Management API Documentation

This document provides comprehensive API documentation for the Cached Product Category Management service, including Redis-based caching, category CRUD operations, bulk operations, and cache management.

## Table of Contents

1. [Authentication](#authentication)
2. [Caching Overview](#caching-overview)
3. [Category Operations](#category-operations)
4. [Bulk Operations](#bulk-operations)
5. [Soft Delete Operations](#soft-delete-operations)
6. [Cache Management](#cache-management)
7. [Error Handling](#error-handling)
8. [Security](#security)

## Authentication

All endpoints require JWT authentication and appropriate RBAC permissions. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

**Required Permissions:**

- `VIEW` permission for GET operations
- `CREATE` permission for POST operations
- `UPDATE` permission for PATCH operations
- `DELETE` permission for DELETE operations

## Caching Overview

The Cached Product Category service implements Redis-based caching to improve performance:

- **Cache Strategy**: Redis caching with automatic invalidation
- **Cache Keys**: Structured keys for categories and category lists
- **Cache TTL**: Configurable time-to-live for cached data
- **Cache Invalidation**: Automatic invalidation on data changes
- **Cache Statistics**: Monitoring and statistics for cache performance

### Cache Benefits

- Reduced database load
- Faster response times
- Improved scalability
- Better user experience

## Category Operations

### Get All Categories (Cached)

**GET** `/api/cached-product-category/cached-product-categories`

Retrieves a paginated list of all product categories with Redis caching.

**Headers:**

```
Authorization: Bearer <your-jwt-token>
```

**Query Parameters:**

- `page` (number): Page number for pagination
- `limit` (number): Number of categories per page
- `search` (string): Search term for category name
- `sortBy` (string): Field to sort by
- `sortOrder` (string): Sort order (asc/desc)
- `forceRefresh` (boolean): Force refresh cache (optional)

**Response:**

```json
{
  "status": 200,
  "message": "Retrieved successfully",
  "data": {
    "productCategories": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Electronics",
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    },
    "cacheInfo": {
      "cached": true,
      "cacheKey": "product_categories:page_1:limit_10",
      "ttl": 3600
    }
  }
}
```

### Get Category by ID (Cached)

**GET** `/api/cached-product-category/cached-product-categories/:id`

Retrieves a specific product category by its ID with Redis caching.

**Response:**

```json
{
  "status": 200,
  "message": "Retrieved successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Electronics",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z",
    "cacheInfo": {
      "cached": true,
      "cacheKey": "product_category:550e8400-e29b-41d4-a716-446655440000",
      "ttl": 3600
    }
  }
}
```

### Create Category

**POST** `/api/cached-product-category/cached-product-categories`

Creates a new product category and invalidates related caches.

**Headers:**

```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "Electronics"
}
```

**Response:**

```json
{
  "status": 200,
  "message": "Created successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Electronics",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z",
    "cacheInvalidated": true
  }
}
```

### Update Category

**PATCH** `/api/cached-product-category/cached-product-categories/:id`

Updates an existing product category and invalidates related caches.

**Headers:**

```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "Updated Electronics"
}
```

**Response:**

```json
{
  "status": 200,
  "message": "Updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Updated Electronics",
    "updated_at": "2024-01-01T00:00:00.000Z",
    "cacheInvalidated": true
  }
}
```

### Delete Category

**DELETE** `/api/cached-product-category/cached-product-categories/:id`

Permanently deletes a product category and invalidates related caches.

**Response:**

```json
{
  "status": 200,
  "message": "Deleted successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "deleted_at": "2024-01-01T00:00:00.000Z",
    "cacheInvalidated": true
  }
}
```

## Bulk Operations

### Create Multiple Categories

**POST** `/api/cached-product-category/cached-product-categories/create-many`

Creates multiple product categories and invalidates related caches.

**Headers:**

```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "productCategories": [
    {
      "name": "Electronics"
    },
    {
      "name": "Clothing"
    },
    {
      "name": "Books"
    }
  ]
}
```

**Response:**

```json
{
  "status": 200,
  "message": "Created successfully",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Electronics",
      "created_at": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "name": "Clothing",
      "created_at": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "name": "Books",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "cacheInvalidated": true
}
```

### Delete Multiple Categories

**POST** `/api/cached-product-category/cached-product-categories/delete-many`

Permanently deletes multiple product categories and invalidates related caches.

**Headers:**

```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "ids": [
    "550e8400-e29b-41d4-a716-446655440001",
    "550e8400-e29b-41d4-a716-446655440002",
    "550e8400-e29b-41d4-a716-446655440003"
  ]
}
```

**Response:**

```json
{
  "status": 200,
  "message": "Deleted successfully",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "deleted_at": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "deleted_at": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "deleted_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "cacheInvalidated": true
}
```

## Soft Delete Operations

### Soft Delete Category

**DELETE** `/api/cached-product-category/cached-product-categories/soft-delete/:id`

Soft deletes a product category and invalidates related caches.

**Response:**

```json
{
  "status": 200,
  "message": "Soft deleted successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "deleted_at": "2024-01-01T00:00:00.000Z",
    "cacheInvalidated": true
  }
}
```

### Soft Delete Multiple Categories

**POST** `/api/cached-product-category/cached-product-categories/soft-delete-many`

Soft deletes multiple product categories and invalidates related caches.

**Headers:**

```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "ids": [
    "550e8400-e29b-41d4-a716-446655440001",
    "550e8400-e29b-41d4-a716-446655440002",
    "550e8400-e29b-41d4-a716-446655440003"
  ]
}
```

**Response:**

```json
{
  "status": 200,
  "message": "Soft deleted successfully",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "deleted_at": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "deleted_at": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "deleted_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "cacheInvalidated": true
}
```

## Cache Management

### Clear Product Category Cache

**POST** `/api/cached-product-category/clear-cache`

Clears all product category related caches.

**Headers:**

```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Response:**

```json
{
  "status": 200,
  "message": "Cache cleared successfully",
  "data": {
    "clearedKeys": [
      "product_categories:page_1:limit_10",
      "product_categories:page_2:limit_10",
      "product_category:550e8400-e29b-41d4-a716-446655440000"
    ],
    "totalKeysCleared": 15
  }
}
```

### Get Cache Statistics

**GET** `/api/cached-product-category/cache-stats`

Retrieves cache statistics and performance metrics.

**Headers:**

```
Authorization: Bearer <your-jwt-token>
```

**Response:**

```json
{
  "status": 200,
  "message": "Cache statistics retrieved successfully",
  "data": {
    "totalCacheKeys": 25,
    "cacheHitRate": 0.85,
    "cacheMissRate": 0.15,
    "averageResponseTime": 45,
    "memoryUsage": "2.5MB",
    "uptime": "24h 30m 15s",
    "lastCacheClear": "2024-01-01T12:00:00.000Z"
  }
}
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "status": 400,
  "message": "Error description",
  "data": null
}
```

Common HTTP status codes:

- `200` - Success
- `400` - Bad Request (validation errors, duplicate category names)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (category doesn't exist)
- `500` - Internal Server Error (database or cache errors)

## Security

- All endpoints require JWT authentication
- RBAC (Role-Based Access Control) is enforced
- Input validation is performed on all endpoints
- SQL injection protection through parameterized queries
- Transaction support for data consistency
- Redis connection security
- Cache key validation and sanitization

## Cache Configuration

### Redis Configuration

- **Host**: Configurable Redis host
- **Port**: Configurable Redis port
- **Password**: Optional Redis authentication
- **Database**: Configurable Redis database number
- **Connection Pool**: Configurable connection pool size

### Cache Settings

- **TTL**: Configurable time-to-live for cached data
- **Key Prefix**: Structured key prefixes for organization
- **Compression**: Optional data compression for large datasets
- **Serialization**: JSON serialization for complex objects

## Performance Optimization

### Cache Strategies

- **Read-Through**: Cache populated on first read
- **Write-Through**: Cache updated immediately on write
- **Cache-Aside**: Application manages cache explicitly
- **Write-Behind**: Cache updates batched for performance

### Cache Invalidation

- **Time-Based**: Automatic expiration based on TTL
- **Event-Based**: Invalidation on data changes
- **Pattern-Based**: Bulk invalidation using key patterns
- **Manual**: Explicit cache clearing when needed

## Testing

### Create Category Test

```bash
curl -X POST http://localhost:3000/api/cached-product-category/cached-product-categories \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Category"
  }'
```

### Get All Categories Test

```bash
curl -X GET "http://localhost:3000/api/cached-product-category/cached-product-categories?page=1&limit=10" \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Force Cache Refresh Test

```bash
curl -X GET "http://localhost:3000/api/cached-product-category/cached-product-categories?forceRefresh=true" \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Clear Cache Test

```bash
curl -X POST http://localhost:3000/api/cached-product-category/clear-cache \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Get Cache Stats Test

```bash
curl -X GET http://localhost:3000/api/cached-product-category/cache-stats \
  -H "Authorization: Bearer <your-jwt-token>"
```

## Monitoring and Maintenance

### Cache Monitoring

- Monitor cache hit/miss rates
- Track memory usage
- Monitor response times
- Alert on cache failures

### Cache Maintenance

- Regular cache cleanup
- Monitor cache size
- Optimize cache keys
- Review cache policies

## Support

For technical support or questions about the Cached Product Category Management API, please contact the development team.
