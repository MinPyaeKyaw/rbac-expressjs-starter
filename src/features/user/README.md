# User Management API Documentation

This document provides comprehensive API documentation for the User Management service, including user CRUD operations, email notifications, and file uploads.

## Table of Contents

1. [Authentication](#authentication)
2. [User Operations](#user-operations)
3. [Email Notifications](#email-notifications)
4. [File Uploads](#file-uploads)
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

## User Operations

### Get All Users

**GET** `/api/user/users`

Retrieves a paginated list of all users with optional filtering.

**Headers:**

```
Authorization: Bearer <your-jwt-token>
```

**Query Parameters:**

- `page` (number): Page number for pagination
- `limit` (number): Number of users per page
- `search` (string): Search term for username, email, or name
- `sortBy` (string): Field to sort by
- `sortOrder` (string): Sort order (asc/desc)

**Response:**

```json
{
  "status": 200,
  "message": "Retrieved successfully",
  "data": {
    "users": [
      {
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

### Get User by ID

**GET** `/api/user/users/:id`

Retrieves a specific user by their ID.

**Response:**

```json
{
  "status": 200,
  "message": "Retrieved successfully",
  "data": {
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
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### Create User

**POST** `/api/user/users`

Creates a new user with profile image upload.

**Headers:**

```
Authorization: Bearer <your-jwt-token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**

- `username` (string, required): Unique username
- `first_name` (string, required): User's first name
- `last_name` (string, required): User's last name
- `email` (string, required): User's email address
- `phone1` (string, optional): Primary phone number
- `phone2` (string, optional): Secondary phone number
- `phone3` (string, optional): Tertiary phone number
- `password` (string, required): User's password
- `address1` (string, optional): Primary address
- `address2` (string, optional): Secondary address
- `img` (file, required): User's profile image

**Response:**

```json
{
  "status": 200,
  "message": "Created successfully",
  "data": {
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
    "role_id": null,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### Update User

**PATCH** `/api/user/users/:id`

Updates an existing user's information.

**Headers:**

```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "Updated Product Name",
  "price": 99.99
}
```

**Response:**

```json
{
  "status": 200,
  "message": "Updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Updated Product Name",
    "price": 99.99,
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### Delete User

**DELETE** `/api/user/users/:id`

Deletes a user from the system.

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

## Email Notifications

### Send Email to All Users

**POST** `/api/user/send-email-users`

Sends email notifications to all users in the system.

**Headers:**

```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Response:**

```json
{
  "status": 200,
  "message": "Emails added to queue!",
  "data": null
}
```

## File Uploads

### Supported File Types

- Images: JPG, JPEG, PNG, GIF
- Maximum file size: 5MB

### File Storage

- User profile images are stored in the `uploads/user-images/` directory
- File paths are stored in the database
- Files are served statically by the application

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
- `400` - Bad Request (validation errors, file upload errors)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (user doesn't exist)
- `500` - Internal Server Error

## Security

- All endpoints require JWT authentication
- RBAC (Role-Based Access Control) is enforced
- File uploads are validated for type and size
- Passwords are hashed using bcrypt
- Input validation is performed on all endpoints
- SQL injection protection through parameterized queries

## RBAC Integration

The User Management system integrates with the RBAC system:

- Users can be assigned roles through the role_id field
- Permissions are checked for each operation
- Admin role is required for most operations
- Audit logs track all user management activities

## Testing

### Create User Test

```bash
curl -X POST http://localhost:3000/api/user/users \
  -H "Authorization: Bearer <your-jwt-token>" \
  -F "username=testuser" \
  -F "first_name=Test" \
  -F "last_name=User" \
  -F "email=test@example.com" \
  -F "password=securepassword123" \
  -F "img=@/path/to/image.jpg"
```

### Get All Users Test

```bash
curl -X GET "http://localhost:3000/api/user/users?page=1&limit=10" \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Update User Test

```bash
curl -X PATCH http://localhost:3000/api/user/users/user-id \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Name", "price": 99.99}'
```

## Support

For technical support or questions about the User Management API, please contact the development team.
