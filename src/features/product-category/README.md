# Product Category Management API Documentation

This document provides comprehensive API documentation for the Product Category Management service, including category CRUD operations, bulk operations, and soft delete functionality.

## Table of Contents

1. [Authentication](#authentication)
2. [Category Operations](#category-operations)
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

## Category Operations

### Get All Categories

**GET** `/api/product-category/product-categories`

Retrieves a paginated list of all product categories with optional filtering.

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
    }
  }
}
```

### Get Category by ID

**GET** `/api/product-category/product-categories/:id`

Retrieves a specific product category by its ID.

**Response:**

```json
{
  "status": 200,
  "message": "Retrieved successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Electronics",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### Create Category

**POST** `/api/product-category/product-categories`

Creates a new product category.

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
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### Update Category

**PATCH** `/api/product-category/product-categories/:id`

Updates an existing product category.

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
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### Delete Category

**DELETE** `/api/product-category/product-categories/:id`

Permanently deletes a product category from the system.

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

### Create Multiple Categories

**POST** `/api/product-category/product-categories/create-many`

Creates multiple product categories in a single request.

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
  ]
}
```

### Delete Multiple Categories

**POST** `/api/product-category/product-categories/delete-many`

Permanently deletes multiple product categories by their IDs.

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

### Soft Delete Category

**DELETE** `/api/product-category/product-categories/soft-delete/:id`

Soft deletes a product category (marks as deleted without removing from database).

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

### Soft Delete Multiple Categories

**POST** `/api/product-category/product-categories/soft-delete-many`

Soft deletes multiple product categories by their IDs.

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
- `400` - Bad Request (validation errors, duplicate category names)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (category doesn't exist)
- `500` - Internal Server Error

## Security

- All endpoints require JWT authentication
- RBAC (Role-Based Access Control) is enforced
- Input validation is performed on all endpoints
- SQL injection protection through parameterized queries
- Transaction support for data consistency
- Duplicate category name validation

## Data Validation

### Category Name

- Required field
- Must be unique across all categories
- Maximum length: 255 characters
- Cannot be empty or contain only whitespace

## RBAC Integration

The Product Category Management system integrates with the RBAC system:

- Admin role is required for all operations
- Permissions are checked for each operation
- Audit logs track all category management activities
- Categories are referenced by products for organization

## Category-Product Relationship

- Categories can have multiple products
- Products must belong to a valid category
- Deleting a category may affect associated products
- Category names should be descriptive and organized

## Testing

### Create Category Test

```bash
curl -X POST http://localhost:3000/api/product-category/product-categories \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Category"
  }'
```

### Get All Categories Test

```bash
curl -X GET "http://localhost:3000/api/product-category/product-categories?page=1&limit=10" \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Create Multiple Categories Test

```bash
curl -X POST http://localhost:3000/api/product-category/product-categories/create-many \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "productCategories": [
      {
        "name": "Electronics"
      },
      {
        "name": "Clothing"
      }
    ]
  }'
```

### Soft Delete Test

```bash
curl -X DELETE http://localhost:3000/api/product-category/product-categories/soft-delete/category-id \
  -H "Authorization: Bearer <your-jwt-token>"
```

## Best Practices

### Category Naming

- Use clear, descriptive names
- Avoid abbreviations unless widely understood
- Maintain consistent naming conventions
- Consider hierarchical organization for complex catalogs

### Category Management

- Regularly review and clean up unused categories
- Ensure categories are not too specific or too broad
- Consider category relationships and dependencies
- Maintain category descriptions for better organization

## Support

For technical support or questions about the Product Category Management API, please contact the development team.
