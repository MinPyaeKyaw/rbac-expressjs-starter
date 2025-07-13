# Product Management API Documentation

This document provides comprehensive API documentation for the Product Management service, including product CRUD operations, bulk operations, and soft delete functionality.

## Table of Contents

1. [Authentication](#authentication)
2. [Product Operations](#product-operations)
3. [Bulk Operations](#bulk-operations)
4. [Soft Delete Operations](#soft-delete-operations)
5. [Error Handling](#error-handling)
6. [Security](#security)

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

## Product Operations

### Get All Products

**GET** `/api/product/products`

Retrieves a paginated list of all products with optional filtering.

**Headers:**

```
Authorization: Bearer <your-jwt-token>
```

**Query Parameters:**

- `page` (number): Page number for pagination
- `limit` (number): Number of products per page
- `search` (string): Search term for product name
- `category_id` (string): Filter by category ID
- `sortBy` (string): Field to sort by
- `sortOrder` (string): Sort order (asc/desc)

**Response:**

```json
{
  "status": 200,
  "message": "Retrieved successfully",
  "data": {
    "products": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Premium Widget",
        "price": 99.99,
        "category_id": "category-uuid-here",
        "category_name": "Electronics",
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

### Get Product by ID

**GET** `/api/product/products/:id`

Retrieves a specific product by its ID.

**Response:**

```json
{
  "status": 200,
  "message": "Retrieved successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Premium Widget",
    "price": 99.99,
    "category_id": "category-uuid-here",
    "category_name": "Electronics",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### Create Product

**POST** `/api/product/products`

Creates a new product.

**Headers:**

```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "Premium Widget",
  "price": 99.99,
  "category_id": "category-uuid-here"
}
```

**Response:**

```json
{
  "status": 200,
  "message": "Created successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Premium Widget",
    "price": 99.99,
    "category_id": "category-uuid-here",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### Update Product

**PATCH** `/api/product/products/:id`

Updates an existing product.

**Headers:**

```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "Updated Premium Widget",
  "price": 149.99,
  "category_id": "new-category-uuid"
}
```

**Response:**

```json
{
  "status": 200,
  "message": "Updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Updated Premium Widget",
    "price": 149.99,
    "category_id": "new-category-uuid",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### Delete Product

**DELETE** `/api/product/products/:id`

Permanently deletes a product from the system.

**Response:**

```json
{
  "status": 200,
  "message": "Deleted successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "deleted_at": "2024-01-01T00:00:00.000Z"
  }
}
```

## Bulk Operations

### Create Multiple Products

**POST** `/api/product/products/create-many`

Creates multiple products in a single request.

**Headers:**

```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "products": [
    {
      "name": "Product 1",
      "price": 29.99,
      "category_id": "category-uuid-1"
    },
    {
      "name": "Product 2",
      "price": 49.99,
      "category_id": "category-uuid-2"
    },
    {
      "name": "Product 3",
      "price": 79.99,
      "category_id": "category-uuid-1"
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
      "name": "Product 1",
      "price": 29.99,
      "category_id": "category-uuid-1",
      "created_at": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "name": "Product 2",
      "price": 49.99,
      "category_id": "category-uuid-2",
      "created_at": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "name": "Product 3",
      "price": 79.99,
      "category_id": "category-uuid-1",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Delete Multiple Products

**POST** `/api/product/products/delete-many`

Permanently deletes multiple products by their IDs.

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
  ]
}
```

## Soft Delete Operations

### Soft Delete Product

**DELETE** `/api/product/products/soft-delete/:id`

Soft deletes a product (marks as deleted without removing from database).

**Response:**

```json
{
  "status": 200,
  "message": "Soft deleted successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "deleted_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### Soft Delete Multiple Products

**POST** `/api/product/products/soft-delete-many`

Soft deletes multiple products by their IDs.

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
  ]
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
- `400` - Bad Request (validation errors, duplicate product names)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (product doesn't exist)
- `500` - Internal Server Error

## Security

- All endpoints require JWT authentication
- RBAC (Role-Based Access Control) is enforced
- Input validation is performed on all endpoints
- SQL injection protection through parameterized queries
- Transaction support for data consistency
- Duplicate product name validation

## Data Validation

### Product Name

- Required field
- Must be unique across all products
- Maximum length: 255 characters

### Price

- Required field
- Must be a positive number
- Supports decimal values

### Category ID

- Required field
- Must reference an existing category
- UUID format validation

## RBAC Integration

The Product Management system integrates with the RBAC system:

- Admin role is required for all operations
- Permissions are checked for each operation
- Audit logs track all product management activities
- Category relationships are maintained

## Testing

### Create Product Test

```bash
curl -X POST http://localhost:3000/api/product/products \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "price": 99.99,
    "category_id": "category-uuid-here"
  }'
```

### Get All Products Test

```bash
curl -X GET "http://localhost:3000/api/product/products?page=1&limit=10" \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Create Multiple Products Test

```bash
curl -X POST http://localhost:3000/api/product/products/create-many \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "products": [
      {
        "name": "Product 1",
        "price": 29.99,
        "category_id": "category-uuid-1"
      },
      {
        "name": "Product 2",
        "price": 49.99,
        "category_id": "category-uuid-2"
      }
    ]
  }'
```

### Soft Delete Test

```bash
curl -X DELETE http://localhost:3000/api/product/products/soft-delete/product-id \
  -H "Authorization: Bearer <your-jwt-token>"
```

## Support

For technical support or questions about the Product Management API, please contact the development team.
