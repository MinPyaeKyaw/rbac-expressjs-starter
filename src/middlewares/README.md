# Middleware Documentation

This directory contains all the middleware used in the RBAC Express.js application.

## HPP (HTTP Parameter Pollution) Middleware

### Overview

The HPP middleware prevents HTTP Parameter Pollution attacks by ensuring only the first occurrence of a parameter is used in requests.

### What is HTTP Parameter Pollution?

HTTP Parameter Pollution occurs when an attacker sends multiple values for the same parameter, which can lead to unexpected behavior in the application.

**Example Attack:**

```
GET /api/users?user=john&user=admin
```

**Without HPP:**

```javascript
req.query.user = ['john', 'admin']; // Array with multiple values
```

**With HPP:**

```javascript
req.query.user = 'john'; // Only first value is used
```

### Configuration

The HPP middleware is configured in `src/middlewares/hpp-config.ts` with the following settings:

#### Whitelisted Parameters

The following parameters are whitelisted and allowed to have multiple values:

**Query Parameters:**

- `category_id` - Product category filtering
- `sortBy` - Sorting field
- `sortOrder` - Sort direction
- `ids` - Bulk operations

**Body Parameters:**

- `productCategories` - Bulk category operations
- `products` - Bulk product operations
- `roles` - Bulk role operations
- `actions` - Bulk action operations
- `modules` - Bulk module operations
- `subModules` - Bulk sub-module operations
- `permissions` - Bulk permission operations
- `channels` - Bulk channel operations

#### Configuration Options

```typescript
const hppOptions = {
  whitelist, // Query parameters that can have multiple values
  checkQuery: true, // Check query string parameters
  checkBody: true, // Check body parameters
  checkBodyOnlyForContentTypes: ['application/x-www-form-urlencoded', 'application/json'],
  whitelistBody: [...] // Body parameters that can have multiple values
};
```

### Usage

The HPP middleware is automatically applied to all routes in `src/app.ts`:

```typescript
import hppMiddleware from './middlewares/hpp-config';

// Apply HPP middleware after helmet and before CORS
app.use(helmet());
app.use(hppMiddleware);
app.use(cors());
```

### Security Benefits

1. **Prevents Parameter Pollution Attacks**: Stops attackers from manipulating parameter values
2. **Consistent Parameter Handling**: Ensures predictable parameter behavior
3. **Reduces Attack Surface**: Minimizes potential security vulnerabilities
4. **Maintains Functionality**: Whitelist allows legitimate multi-value parameters

### Testing

You can test the HPP middleware with the following examples:

#### Test Parameter Pollution Prevention

```bash
# This should only use the first 'user' parameter
curl "http://localhost:3000/api/users?user=john&user=admin"
```

#### Test Whitelisted Parameters

```bash
# These parameters are allowed to have multiple values
curl "http://localhost:3000/api/products?category_id=1&category_id=2"
```

#### Test Bulk Operations

```bash
# Body parameters for bulk operations are whitelisted
curl -X POST "http://localhost:3000/api/products/create-many" \
  -H "Content-Type: application/json" \
  -d '{
    "products": [
      {"name": "Product 1", "price": 10},
      {"name": "Product 2", "price": 20}
    ]
  }'
```

### Customization

To modify the HPP configuration:

1. Edit `src/middlewares/hpp-config.ts`
2. Add or remove parameters from the `whitelist` array
3. Modify the `hppOptions` configuration
4. Restart the application

### Best Practices

1. **Whitelist Only Necessary Parameters**: Only whitelist parameters that legitimately need multiple values
2. **Regular Review**: Periodically review the whitelist to ensure it's still necessary
3. **Documentation**: Keep the whitelist documented for team awareness
4. **Testing**: Test both whitelisted and non-whitelisted parameters

### Troubleshooting

If you encounter issues with the HPP middleware:

1. **Check Whitelist**: Ensure the parameter is in the whitelist if it needs multiple values
2. **Content Type**: Verify the request content type is supported
3. **Middleware Order**: Ensure HPP is applied before route handlers
4. **Logs**: Check application logs for HPP-related errors

## Other Middleware

### Error Handler

- `error-handler.ts` - Centralized error handling middleware

### Authentication

- `jwt.ts` - JWT token verification middleware

### RBAC

- `rbac.ts` - Role-based access control middleware

### Validation

- `validation.ts` - Request validation middleware

### File Upload

- `multer-upload.ts` - File upload handling middleware

### Audit Logging

- `audit-log.ts` - Request audit logging middleware
