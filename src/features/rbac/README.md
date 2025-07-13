# RBAC (Role-Based Access Control) API Documentation

This document provides comprehensive API documentation for the Role-Based Access Control (RBAC) system, including Actions, Modules, Sub-Modules, Permissions, Roles, and Channels management.

## Table of Contents

1. [Authentication](#authentication)
2. [RBAC Overview](#rbac-overview)
3. [Actions Management](#actions-management)
4. [Modules Management](#modules-management)
5. [Sub-Modules Management](#sub-modules-management)
6. [Permissions Management](#permissions-management)
7. [Roles Management](#roles-management)
8. [Channels Management](#channels-management)
9. [Error Handling](#error-handling)
10. [Security](#security)

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

## RBAC Overview

The RBAC system provides granular access control through the following components:

### Core Components

- **Actions**: Define what can be done (CREATE, READ, UPDATE, DELETE, VIEW)
- **Modules**: Define major system areas (USER_MANAGEMENT, PRODUCT, PAYMENT)
- **Sub-Modules**: Define specific areas within modules (USER, ROLE, PRODUCT_CATEGORY)
- **Permissions**: Link actions to modules and sub-modules
- **Roles**: Group permissions for user assignment
- **Channels**: Define access channels (WEB, MOBILE, API)

### Permission Structure

```
Permission = Action + Module + Sub-Module + Channel
Example: CREATE + USER_MANAGEMENT + USER + WEB
```

## Actions Management

### Get All Actions

**GET** `/api/rbac/actions`

Retrieves a paginated list of all actions.

**Response:**

```json
{
  "status": 200,
  "message": "Retrieved successfully",
  "data": {
    "actions": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "CREATE",
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z"
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "name": "READ",
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

### Create Action

**POST** `/api/rbac/actions/create`

Creates a new action.

**Request Body:**

```json
{
  "name": "EXPORT"
}
```

### Update Action

**PATCH** `/api/rbac/actions/update/:id`

Updates an existing action.

**Request Body:**

```json
{
  "name": "EXPORT_DATA"
}
```

### Delete Action

**DELETE** `/api/rbac/actions/delete/:id`

Permanently deletes an action.

### Bulk Operations

**POST** `/api/rbac/actions/create-multi`

Creates multiple actions.

**Request Body:**

```json
{
  "actions": [
    {
      "name": "IMPORT"
    },
    {
      "name": "EXPORT"
    },
    {
      "name": "APPROVE"
    }
  ]
}
```

## Modules Management

### Get All Modules

**GET** `/api/rbac/modules`

Retrieves a paginated list of all modules.

**Response:**

```json
{
  "status": 200,
  "message": "Retrieved successfully",
  "data": {
    "modules": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "USER_MANAGEMENT",
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z"
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "name": "PRODUCT",
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

### Create Module

**POST** `/api/rbac/modules/create`

Creates a new module.

**Request Body:**

```json
{
  "name": "REPORTING"
}
```

### Update Module

**PATCH** `/api/rbac/modules/update/:id`

Updates an existing module.

**Request Body:**

```json
{
  "name": "ANALYTICS"
}
```

### Delete Module

**DELETE** `/api/rbac/modules/delete/:id`

Permanently deletes a module.

### Bulk Operations

**POST** `/api/rbac/modules/create-multi`

Creates multiple modules.

**Request Body:**

```json
{
  "modules": [
    {
      "name": "REPORTING"
    },
    {
      "name": "ANALYTICS"
    },
    {
      "name": "SETTINGS"
    }
  ]
}
```

## Sub-Modules Management

### Get All Sub-Modules

**GET** `/api/rbac/sub-modules`

Retrieves a paginated list of all sub-modules.

**Response:**

```json
{
  "status": 200,
  "message": "Retrieved successfully",
  "data": {
    "subModules": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "USER",
        "module_id": "module-uuid-here",
        "module_name": "USER_MANAGEMENT",
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 10,
      "totalPages": 1
    }
  }
}
```

### Create Sub-Module

**POST** `/api/rbac/sub-modules/create`

Creates a new sub-module.

**Request Body:**

```json
{
  "name": "USER_PROFILE",
  "module_id": "module-uuid-here"
}
```

### Update Sub-Module

**PATCH** `/api/rbac/sub-modules/update/:id`

Updates an existing sub-module.

**Request Body:**

```json
{
  "name": "USER_SETTINGS",
  "module_id": "module-uuid-here"
}
```

### Delete Sub-Module

**DELETE** `/api/rbac/sub-modules/delete/:id`

Permanently deletes a sub-module.

### Bulk Operations

**POST** `/api/rbac/sub-modules/create-multi`

Creates multiple sub-modules.

**Request Body:**

```json
{
  "subModules": [
    {
      "name": "USER_PROFILE",
      "module_id": "module-uuid-1"
    },
    {
      "name": "USER_ROLES",
      "module_id": "module-uuid-1"
    }
  ]
}
```

## Permissions Management

### Get All Permissions

**GET** `/api/rbac/permissions`

Retrieves a paginated list of all permissions.

**Response:**

```json
{
  "status": 200,
  "message": "Retrieved successfully",
  "data": {
    "permissions": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "action_id": "action-uuid-here",
        "action_name": "CREATE",
        "module_id": "module-uuid-here",
        "module_name": "USER_MANAGEMENT",
        "sub_module_id": "sub-module-uuid-here",
        "sub_module_name": "USER",
        "channel_id": "channel-uuid-here",
        "channel_name": "WEB",
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

### Create Permission

**POST** `/api/rbac/permissions/create`

Creates a new permission.

**Request Body:**

```json
{
  "action_id": "action-uuid-here",
  "module_id": "module-uuid-here",
  "sub_module_id": "sub-module-uuid-here",
  "channel_id": "channel-uuid-here"
}
```

### Update Permission

**PATCH** `/api/rbac/permissions/update/:id`

Updates an existing permission.

**Request Body:**

```json
{
  "action_id": "new-action-uuid",
  "module_id": "new-module-uuid",
  "sub_module_id": "new-sub-module-uuid",
  "channel_id": "new-channel-uuid"
}
```

### Delete Permission

**DELETE** `/api/rbac/permissions/delete/:id`

Permanently deletes a permission.

### Bulk Operations

**POST** `/api/rbac/permissions/create-multi`

Creates multiple permissions.

**Request Body:**

```json
{
  "permissions": [
    {
      "action_id": "action-uuid-1",
      "module_id": "module-uuid-1",
      "sub_module_id": "sub-module-uuid-1",
      "channel_id": "channel-uuid-1"
    },
    {
      "action_id": "action-uuid-2",
      "module_id": "module-uuid-1",
      "sub_module_id": "sub-module-uuid-2",
      "channel_id": "channel-uuid-1"
    }
  ]
}
```

## Roles Management

### Get All Roles

**GET** `/api/rbac/roles`

Retrieves a paginated list of all roles.

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

### Create Role

**POST** `/api/rbac/roles/create`

Creates a new role.

**Request Body:**

```json
{
  "name": "Manager"
}
```

### Update Role

**PATCH** `/api/rbac/roles/update/:id`

Updates an existing role.

**Request Body:**

```json
{
  "name": "Senior Manager"
}
```

### Delete Role

**DELETE** `/api/rbac/roles/delete/:id`

Permanently deletes a role.

### Bulk Operations

**POST** `/api/rbac/roles/create-multi`

Creates multiple roles.

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

## Channels Management

### Get All Channels

**GET** `/api/rbac/channels`

Retrieves a paginated list of all channels.

**Response:**

```json
{
  "status": 200,
  "message": "Retrieved successfully",
  "data": {
    "channels": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "WEB",
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z"
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "name": "MOBILE",
        "created_at": "2024-01-01T00:00:00.000Z",
        "updated_at": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 3,
      "totalPages": 1
    }
  }
}
```

### Create Channel

**POST** `/api/rbac/channels/create`

Creates a new channel.

**Request Body:**

```json
{
  "name": "API"
}
```

### Update Channel

**PATCH** `/api/rbac/channels/update/:id`

Updates an existing channel.

**Request Body:**

```json
{
  "name": "REST_API"
}
```

### Delete Channel

**DELETE** `/api/rbac/channels/delete/:id`

Permanently deletes a channel.

### Bulk Operations

**POST** `/api/rbac/channels/create-multi`

Creates multiple channels.

**Request Body:**

```json
{
  "channels": [
    {
      "name": "API"
    },
    {
      "name": "CLI"
    },
    {
      "name": "SDK"
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
- `400` - Bad Request (validation errors, duplicate names)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

## Security

- All endpoints require JWT authentication
- RBAC (Role-Based Access Control) is enforced
- Input validation is performed on all endpoints
- SQL injection protection through parameterized queries
- Transaction support for data consistency
- Duplicate name validation
- Referential integrity checks

## Data Validation

### Name Fields

- Required field
- Must be unique within the same type
- Maximum length: 255 characters
- Cannot be empty or contain only whitespace
- Reserved names: "Admin", "System" (case-insensitive)

### Relationship Constraints

- Cannot delete items that are referenced by other entities
- Cannot modify system items (Admin role, core actions)
- Foreign key relationships must be valid

## RBAC Best Practices

### Permission Design

- Follow the principle of least privilege
- Use descriptive action names
- Organize modules logically
- Keep sub-modules focused and specific

### Role Design

- Create roles based on job functions
- Avoid role proliferation
- Document role purposes
- Regular role reviews and cleanup

### Security Considerations

- Limit RBAC management to authorized administrators
- Regular permission audits
- Monitor permission usage
- Implement access logging

## Testing

### Create Action Test

```bash
curl -X POST http://localhost:3000/api/rbac/actions/create \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "EXPORT"
  }'
```

### Create Permission Test

```bash
curl -X POST http://localhost:3000/api/rbac/permissions/create \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "action_id": "action-uuid-here",
    "module_id": "module-uuid-here",
    "sub_module_id": "sub-module-uuid-here",
    "channel_id": "channel-uuid-here"
  }'
```

### Get All Permissions Test

```bash
curl -X GET "http://localhost:3000/api/rbac/permissions?page=1&limit=10" \
  -H "Authorization: Bearer <your-jwt-token>"
```

## RBAC Lifecycle

### System Setup

1. Create core actions (CREATE, READ, UPDATE, DELETE, VIEW)
2. Create modules (USER_MANAGEMENT, PRODUCT, etc.)
3. Create sub-modules (USER, ROLE, etc.)
4. Create channels (WEB, MOBILE, API)
5. Create permissions by combining actions, modules, sub-modules, and channels
6. Create roles and assign permissions
7. Assign roles to users

### Permission Management

1. Identify required permissions
2. Create or modify permissions
3. Assign permissions to roles
4. Test permission enforcement
5. Monitor permission usage

### Role Management

1. Define role requirements
2. Create roles with appropriate permissions
3. Assign roles to users
4. Monitor role usage
5. Regular role reviews and updates

## Support

For technical support or questions about the RBAC API, please contact the development team.
