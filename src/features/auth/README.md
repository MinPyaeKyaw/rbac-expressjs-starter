# Authentication API Documentation

This document provides comprehensive API documentation for the Authentication service, including user login, token refresh, and permission management.

## Table of Contents

1. [Authentication](#authentication)
2. [User Login](#user-login)
3. [Token Refresh](#token-refresh)
4. [Error Handling](#error-handling)
5. [Security](#security)

## Authentication

All endpoints require JWT authentication except for the login endpoint. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## User Login

### Login User

**POST** `/api/auth/login`

Authenticates a user and returns access token, refresh token, and user permissions.

**Request Body:**

```json
{
  "username": "john_doe",
  "password": "securepassword123"
}
```

**Response:**

```json
{
  "status": 200,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "john_doe",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "phone1": "+1234567890",
    "phone2": "+1234567891",
    "phone3": "+1234567892",
    "address1": "123 Main St",
    "address2": "Apt 4B",
    "img": "uploads/user-images/john_doe.jpg",
    "role_id": "role-uuid-here",
    "permissions": [
      {
        "action": "VIEW",
        "module": "USER_MANAGEMENT",
        "sub_module": "USER"
      },
      {
        "action": "CREATE",
        "module": "PRODUCT",
        "sub_module": "PRODUCT"
      }
    ]
  }
}
```

**Error Responses:**

```json
{
  "status": 400,
  "message": "User not found",
  "data": null
}
```

```json
{
  "status": 400,
  "message": "Invalid credentials",
  "data": null
}
```

## Token Refresh

### Refresh Access Token

**POST** `/api/auth/refresh-token`

Refreshes the access token using a valid refresh token.

**Headers:**

```
Authorization: Bearer <refresh-token>
```

**Response:**

```json
{
  "status": 200,
  "message": "Created successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response:**

```json
{
  "status": 400,
  "message": "User not found",
  "data": null
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
- `400` - Bad Request (validation errors, invalid credentials)
- `401` - Unauthorized (missing or invalid token)
- `500` - Internal Server Error

## Security

- Passwords are hashed using bcrypt before storage
- JWT tokens are used for authentication
- Refresh tokens are used for token renewal
- Input validation is performed on all endpoints
- User permissions are returned with login response for RBAC implementation

## Token Management

### Access Token

- Short-lived token for API access
- Contains user information and permissions
- Used for all authenticated API calls

### Refresh Token

- Long-lived token for token renewal
- Used to obtain new access tokens
- Should be stored securely

## Permission System

The authentication system integrates with the RBAC (Role-Based Access Control) system:

- User permissions are fetched based on their role
- Permissions include action, module, and sub-module information
- Used by the RBAC middleware to control access to protected endpoints

## Testing

### Login Testing

1. **Valid Credentials:**

   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username": "admin", "password": "admin123"}'
   ```

2. **Invalid Credentials:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username": "admin", "password": "wrongpassword"}'
   ```

### Token Refresh Testing

```bash
curl -X POST http://localhost:3000/api/auth/refresh-token \
  -H "Authorization: Bearer <refresh-token>"
```

## Support

For technical support or questions about the Authentication API, please contact the development team.
