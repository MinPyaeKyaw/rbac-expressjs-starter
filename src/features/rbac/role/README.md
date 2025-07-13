# RBAC Role Management API Documentation

This document provides comprehensive API documentation for the Role-Based Access Control (RBAC) Role Management service, including role CRUD operations, bulk operations, and soft delete functionality.

## Table of Contents

1. [Authentication](#authentication)
2. [Role Operations](#role-operations)
3. [Bulk Operations](#bulk-operations)
4. [Soft Delete Operations](#soft-delete-operations)
5. [RBAC Integration](#rbac-integration)
6. [Error Handling](#error-handling)
7. [Security](#security)

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

**Required Role:** Admin role is required for all operations.

## Role Operations

### Get All Roles

**GET** `/api/rbac/roles`

Retrieves a paginated list of all roles with optional filtering.

**Headers:**

```
Authorization: Bearer <your-jwt-token>
```

**Query Parameters:**

- `page` (number): Page number for pagination
- `limit` (number): Number of roles per page
- `search` (string): Search term for role name
- `sortBy` (string): Field to sort by
- `sortOrder` (string): Sort order (asc/desc)

**Response:**

```json
{
  "status": 200,
  "message": "Retrieved successfully",
  "data": {
    "roles": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Admin",
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z"
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "name": "User",
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "totalPages": 1
    }
  }
}
```

### Get Role by ID

**GET** `/api/rbac/roles/:id`

Retrieves a specific role by its ID.

**Response:**

```json
{
  "status": 200,
  "message": "Retrieved successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Admin",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### Create Role

**POST** `/api/rbac/roles/create`

Creates a new role.

**Headers:**

```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "Manager"
}
```

**Response:**

```json
{
  "status": 200,
  "message": "Created successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "name": "Manager",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### Update Role

**PATCH** `/api/rbac/roles/update/:id`

Updates an existing role.

**Headers:**

```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "Senior Manager"
}
```

**Response:**

```json
{
  "status": 200,
  "message": "Updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "name": "Senior Manager",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### Delete Role

**DELETE** `/api/rbac/roles/delete/:id`

Permanently deletes a role from the system.

**Response:**

```json
{
  "status": 200,
  "message": "Deleted successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "deleted_at": "2024-01-01T00:00:00.000Z"
  }
}
```

## Bulk Operations

### Create Multiple Roles

**POST** `/api/rbac/roles/create-multi`

Creates multiple roles in a single request.

**Headers:**

```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "roles": [
    {
      "name": "Editor"
    },
    {
      "name": "Viewer"
    },
    {
      "name": "Moderator"
    }
  ]
}
```

**Response:**

```json
{
  "status": 200,
  "message": "Created successfully",
  "data": null
}
```

### Delete Multiple Roles

**POST** `/api/rbac/roles/delete-multi`

Permanently deletes multiple roles by their IDs.

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
  "data": null
}
```

## Soft Delete Operations

### Soft Delete Role

**DELETE** `/api/rbac/roles/soft-delete/:id`

Soft deletes a role (marks as deleted without removing from database).

**Response:**

```json
{
  "status": 200,
  "message": "Soft deleted successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "deleted_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### Soft Delete Multiple Roles

**POST** `/api/rbac/roles/soft-delete-multi`

Soft deletes multiple roles by their IDs.

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
  "data": null
}
```

## RBAC Integration

### Role Hierarchy

The RBAC system supports role-based permissions:

- **Admin**: Full system access
- **Manager**: Department-level access
- **User**: Basic user access
- **Viewer**: Read-only access

### Permission Assignment

Roles are assigned permissions through the permission system:

- Each role can have multiple permissions
- Permissions define actions on specific modules
- Permissions are checked at the middleware level

### User-Role Assignment

Users are assigned roles through the user management system:

- Users can have one primary role
- Role assignments are managed through user endpoints
- Role changes require appropriate permissions

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
- `400` - Bad Request (validation errors, duplicate role names)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (role doesn't exist)
- `500` - Internal Server Error

## Security

- All endpoints require JWT authentication
- RBAC (Role-Based Access Control) is enforced
- Input validation is performed on all endpoints
- SQL injection protection through parameterized queries
- Transaction support for data consistency
- Duplicate role name validation
- Role deletion validation (check for assigned users)

## Data Validation

### Role Name

- Required field
- Must be unique across all roles
- Maximum length: 255 characters
- Cannot be empty or contain only whitespace
- Reserved names: "Admin", "System" (case-insensitive)

### Role Constraints

- Cannot delete roles that have assigned users
- Cannot modify system roles (Admin)
- Role names should be descriptive and meaningful

## Best Practices

### Role Naming

- Use clear, descriptive names
- Follow consistent naming conventions
- Avoid abbreviations unless widely understood
- Consider role hierarchy and relationships

### Role Management

- Regularly review and clean up unused roles
- Ensure roles have appropriate permissions
- Document role purposes and responsibilities
- Maintain role hierarchy documentation

### Security Considerations

- Limit role creation to authorized administrators
- Regularly audit role assignments
- Monitor role usage and permissions
- Implement role-based access logging

## Testing

### Create Role Test

```bash
curl -X POST http://localhost:3000/api/rbac/roles/create \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Role"
  }'
```

### Get All Roles Test

```bash
curl -X GET "http://localhost:3000/api/rbac/roles?page=1&limit=10" \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Create Multiple Roles Test

```bash
curl -X POST http://localhost:3000/api/rbac/roles/create-multi \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "roles": [
      {
        "name": "Editor"
      },
      {
        "name": "Viewer"
      }
    ]
  }'
```

### Soft Delete Test

```bash
curl -X DELETE http://localhost:3000/api/rbac/roles/soft-delete/role-id \
  -H "Authorization: Bearer <your-jwt-token>"
```

## Role Lifecycle

### Role Creation

1. Validate role name uniqueness
2. Create role record
3. Assign default permissions (if applicable)
4. Log role creation activity

### Role Assignment

1. Validate user exists
2. Validate role exists
3. Assign role to user
4. Update user permissions
5. Log role assignment

### Role Modification

1. Validate role exists
2. Check modification permissions
3. Update role information
4. Invalidate related caches
5. Log role modification

### Role Deletion

1. Check for assigned users
2. Validate deletion permissions
3. Perform soft or hard delete
4. Update related records
5. Log role deletion

## Support

For technical support or questions about the RBAC Role Management API, please contact the development team.
