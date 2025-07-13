# Payment API Documentation

This document provides comprehensive API documentation for the Payment service, including Stripe integration for products, prices, subscriptions, invoices, and webhooks with email notifications.

## Table of Contents

1. [Authentication](#authentication)
2. [Payment Intents](#payment-intents)
3. [Payment Methods](#payment-methods)
4. [Customers](#customers)
5. [Stripe Products](#stripe-products)
6. [Stripe Prices](#stripe-prices)
7. [Stripe Subscriptions](#stripe-subscriptions)
8. [Stripe Invoices](#stripe-invoices)
9. [Stripe Invoice Items](#stripe-invoice-items)
10. [Stripe Webhooks](#stripe-webhooks)

## Authentication

All endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Payment Intents

### Create Payment Intent

**POST** `/api/payment/payment-intent`

Creates a new payment intent for processing payments.

**Request Body:**

```json
{
  "amount": 2000,
  "currency": "usd",
  "paymentMethodTypes": ["card"],
  "description": "Payment for services",
  "metadata": {
    "orderId": "12345"
  },
  "customerId": "cus_xxx"
}
```

**Response:**

```json
{
  "status": 200,
  "message": "Payment intent created successfully",
  "data": {
    "paymentIntent": {
      "id": "pi_xxx",
      "amount": 2000,
      "currency": "usd",
      "status": "requires_payment_method"
    },
    "paymentRecord": {
      "id": "xxx",
      "stripePaymentIntentId": "pi_xxx",
      "amount": 2000,
      "currency": "usd",
      "status": "pending"
    }
  }
}
```

### Confirm Payment Intent

**POST** `/api/payment/payment-intent/confirm`

Confirms a payment intent with a payment method.

**Request Body:**

```json
{
  "paymentIntentId": "pi_xxx",
  "paymentMethodId": "pm_xxx"
}
```

### Cancel Payment Intent

**DELETE** `/api/payment/payment-intent/:paymentIntentId`

Cancels a payment intent.

### Process Refund

**POST** `/api/payment/payment-intent/:paymentIntentId/refund`

Processes a refund for a successful payment.

**Request Body:**

```json
{
  "amount": 1000,
  "reason": "requested_by_customer"
}
```

## Payment Methods

### Create Payment Method

**POST** `/api/payment/payment-method`

Creates a new payment method.

**Request Body:**

```json
{
  "type": "card",
  "card": {
    "number": "4242424242424242",
    "exp_month": 12,
    "exp_year": 2025,
    "cvc": "123"
  },
  "billing_details": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  }
}
```

## Customers

### Create Customer

**POST** `/api/payment/customer`

Creates a new Stripe customer.

**Request Body:**

```json
{
  "email": "customer@example.com",
  "name": "John Doe"
}
```

## Stripe Products

### Create Product

**POST** `/api/payment/stripe/product`

Creates a new Stripe product.

**Request Body:**

```json
{
  "name": "Premium Plan",
  "description": "Premium subscription plan",
  "active": true,
  "metadata": {
    "category": "subscription"
  },
  "images": ["https://example.com/image.jpg"]
}
```

### Get Product

**GET** `/api/payment/stripe/product/:productId`

Retrieves a Stripe product by ID.

### List Products

**GET** `/api/payment/stripe/products`

Lists all Stripe products with optional filtering.

**Query Parameters:**

- `limit` (number): Number of products to return
- `startingAfter` (string): Pagination cursor
- `endingBefore` (string): Pagination cursor
- `active` (boolean): Filter by active status

### Update Product

**PUT** `/api/payment/stripe/product/:productId`

Updates a Stripe product.

**Request Body:**

```json
{
  "name": "Updated Premium Plan",
  "description": "Updated description",
  "active": true
}
```

### Delete Product

**DELETE** `/api/payment/stripe/product/:productId`

Deletes a Stripe product.

### Create Product for Local Product

**POST** `/api/payment/stripe/product/integrate`

Creates a Stripe product and price for an existing local product.

**Request Body:**

```json
{
  "localProductId": "507f1f77bcf86cd799439011",
  "name": "Local Product Name",
  "description": "Product description",
  "price": 2999,
  "currency": "usd",
  "metadata": {
    "localProductId": "507f1f77bcf86cd799439011"
  }
}
```

## Stripe Prices

### Create Price

**POST** `/api/payment/stripe/price`

Creates a new Stripe price.

**Request Body:**

```json
{
  "productId": "prod_xxx",
  "unitAmount": 2999,
  "currency": "usd",
  "recurring": {
    "interval": "month",
    "intervalCount": 1
  },
  "active": true
}
```

### Get Price

**GET** `/api/payment/stripe/price/:priceId`

Retrieves a Stripe price by ID.

### List Prices

**GET** `/api/payment/stripe/prices`

Lists all Stripe prices with optional filtering.

**Query Parameters:**

- `productId` (string): Filter by product ID
- `limit` (number): Number of prices to return
- `startingAfter` (string): Pagination cursor
- `endingBefore` (string): Pagination cursor
- `active` (boolean): Filter by active status

### Update Price

**PUT** `/api/payment/stripe/price/:priceId`

Updates a Stripe price.

**Request Body:**

```json
{
  "active": false,
  "metadata": {
    "updated": "true"
  }
}
```

## Stripe Subscriptions

### Create Subscription

**POST** `/api/payment/stripe/subscription`

Creates a new Stripe subscription.

**Request Body:**

```json
{
  "customerId": "cus_xxx",
  "priceId": "price_xxx",
  "trialPeriodDays": 7,
  "metadata": {
    "plan": "premium"
  },
  "cancelAtPeriodEnd": false
}
```

**Response:**

```json
{
  "status": 200,
  "message": "Subscription created successfully",
  "data": {
    "id": "sub_xxx",
    "status": "trialing",
    "current_period_start": 1640995200,
    "current_period_end": 1641600000,
    "trial_start": 1640995200,
    "trial_end": 1641600000
  }
}
```

### Get Subscription

**GET** `/api/payment/stripe/subscription/:subscriptionId`

Retrieves a Stripe subscription by ID.

### List Subscriptions

**GET** `/api/payment/stripe/subscriptions`

Lists all Stripe subscriptions with optional filtering.

**Query Parameters:**

- `customerId` (string): Filter by customer ID
- `status` (string): Filter by status (active, past_due, canceled, etc.)
- `limit` (number): Number of subscriptions to return
- `startingAfter` (string): Pagination cursor
- `endingBefore` (string): Pagination cursor

### Update Subscription

**PUT** `/api/payment/stripe/subscription/:subscriptionId`

Updates a Stripe subscription.

**Request Body:**

```json
{
  "cancelAtPeriodEnd": true,
  "metadata": {
    "updated": "true"
  },
  "priceId": "price_xxx"
}
```

### Cancel Subscription

**DELETE** `/api/payment/stripe/subscription/:subscriptionId`

Cancels a Stripe subscription.

## Stripe Invoices

### Create Invoice

**POST** `/api/payment/stripe/invoice`

Creates a new Stripe invoice.

**Request Body:**

```json
{
  "customerId": "cus_xxx",
  "subscriptionId": "sub_xxx",
  "description": "Invoice for services",
  "metadata": {
    "orderId": "12345"
  },
  "dueDate": 1641600000,
  "autoAdvance": true
}
```

### Get Invoice

**GET** `/api/payment/stripe/invoice/:invoiceId`

Retrieves a Stripe invoice by ID.

### List Invoices

**GET** `/api/payment/stripe/invoices`

Lists all Stripe invoices with optional filtering.

**Query Parameters:**

- `customerId` (string): Filter by customer ID
- `subscriptionId` (string): Filter by subscription ID
- `status` (string): Filter by status (draft, open, paid, etc.)
- `limit` (number): Number of invoices to return
- `startingAfter` (string): Pagination cursor
- `endingBefore` (string): Pagination cursor

### Update Invoice

**PUT** `/api/payment/stripe/invoice/:invoiceId`

Updates a Stripe invoice.

**Request Body:**

```json
{
  "description": "Updated invoice description",
  "metadata": {
    "updated": "true"
  },
  "dueDate": 1641600000
}
```

### Finalize Invoice

**POST** `/api/payment/stripe/invoice/:invoiceId/finalize`

Finalizes a draft invoice.

### Pay Invoice

**POST** `/api/payment/stripe/invoice/:invoiceId/pay`

Pays an open invoice.

### Void Invoice

**POST** `/api/payment/stripe/invoice/:invoiceId/void`

Voids an open invoice.

### Send Invoice

**POST** `/api/payment/stripe/invoice/:invoiceId/send`

Sends an invoice to the customer.

## Stripe Invoice Items

### Create Invoice Item

**POST** `/api/payment/stripe/invoice-item`

Creates a new Stripe invoice item.

**Request Body:**

```json
{
  "customerId": "cus_xxx",
  "invoiceId": "in_xxx",
  "priceId": "price_xxx",
  "amount": 2999,
  "currency": "usd",
  "description": "Premium plan subscription",
  "quantity": 1,
  "metadata": {
    "itemType": "subscription"
  }
}
```

### Update Invoice Item

**PUT** `/api/payment/stripe/invoice-item/:itemId`

Updates a Stripe invoice item.

**Request Body:**

```json
{
  "amount": 3999,
  "description": "Updated description",
  "quantity": 2,
  "metadata": {
    "updated": "true"
  }
}
```

### Delete Invoice Item

**DELETE** `/api/payment/stripe/invoice-item/:itemId`

Deletes a Stripe invoice item.

## Stripe Webhooks

### Webhook Endpoint

**POST** `/api/payment/webhook`

Handles Stripe webhook events with automatic email notifications for subscription lifecycle events.

**Headers:**

```
Content-Type: application/json
Stripe-Signature: <stripe-signature>
```

**Supported Events:**

- `customer.subscription.trial_will_end` - Sends email when trial period is ending
- `customer.subscription.deleted` - Sends email when subscription is cancelled
- `invoice.payment_succeeded` - Sends email when payment is successful
- `invoice.payment_failed` - Sends email when payment fails
- `customer.subscription.updated` - Sends email for subscription updates (e.g., past due)

**Email Notifications:**

1. **Trial Ending Notification**

   - Triggered: 3 days before trial ends
   - Content: Trial end date, product details, subscription amount
   - Template: `trial-ending`

2. **Subscription Cancelled Notification**

   - Triggered: When subscription is cancelled
   - Content: Cancellation date, access until date, product details
   - Template: `subscription-cancelled`

3. **Payment Successful Notification**

   - Triggered: When payment is processed successfully
   - Content: Payment amount, date, receipt URL, next billing date
   - Template: `payment-successful`

4. **Payment Failed Notification**

   - Triggered: When payment fails
   - Content: Failed amount, retry date, instructions to update payment method
   - Template: `payment-failed`

5. **Subscription Past Due Notification**
   - Triggered: When subscription becomes past due
   - Content: Due date, product details, instructions to update payment method
   - Template: `subscription-past-due`

**Response:**

```json
{
  "success": true,
  "message": "Webhook processed successfully for event: customer.subscription.trial_will_end",
  "eventType": "customer.subscription.trial_will_end"
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Invalid webhook signature"
}
```

### Webhook Setup

1. **Configure Webhook Secret:**
   Set the `STRIPE_WEBHOOK_SECRET` environment variable with your webhook endpoint secret from Stripe Dashboard.

2. **Configure Email Settings:**
   Set the following environment variables for email notifications:

   ```
   FROM_EMAIL=your-email@gmail.com
   PASSWORD=your-app-password
   ```

3. **Stripe Dashboard Configuration:**
   - Go to Stripe Dashboard > Webhooks
   - Add endpoint: `https://your-domain.com/api/payment/webhook`
   - Select events to listen for:
     - `customer.subscription.trial_will_end`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
     - `customer.subscription.updated`

### Email Templates

The webhook system uses HTML email templates with the following data structure:

**Trial Ending Template:**

```html
<div>
  <h2>Your Trial Period is Ending Soon</h2>
  <p>Dear {{customerName}},</p>
  <p>
    Your trial period for <strong>{{productName}}</strong> will end on
    <strong>{{trialEndDate}}</strong>.
  </p>
  <div>
    <h3>Subscription Details:</h3>
    <p><strong>Product:</strong> {{productName}}</p>
    <p><strong>Amount:</strong> ${{amount}} {{currency}}</p>
    <p><strong>Subscription ID:</strong> {{subscriptionId}}</p>
  </div>
</div>
```

**Payment Successful Template:**

```html
<div>
  <h2>Payment Successful!</h2>
  <p>Dear {{customerName}},</p>
  <p>
    Thank you for your payment of <strong>${{amount}} {{currency}}</strong> for
    <strong>{{productName}}</strong>.
  </p>
  <div>
    <h3>Payment Details:</h3>
    <p><strong>Amount:</strong> ${{amount}} {{currency}}</p>
    <p><strong>Date:</strong> {{paymentDate}}</p>
    <p><strong>Invoice ID:</strong> {{invoiceId}}</p>
    <p><strong>Receipt:</strong> <a href="{{receiptUrl}}">View Receipt</a></p>
    <p><strong>Next Billing Date:</strong> {{nextBillingDate}}</p>
  </div>
</div>
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
- `400` - Bad Request (validation errors, invalid data)
- `401` - Unauthorized (missing or invalid token)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

## Rate Limiting

The API implements rate limiting to prevent abuse. Limits are applied per IP address and user account.

## Security

- All endpoints require JWT authentication
- Webhook signatures are verified using Stripe's webhook secret
- Sensitive data is encrypted and not logged
- Input validation is performed on all endpoints
- CORS is configured for secure cross-origin requests

## Testing

### Webhook Testing with Stripe CLI

1. Install Stripe CLI
2. Login to your Stripe account
3. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/payment/webhook
   ```
4. Trigger test events:
   ```bash
   stripe trigger customer.subscription.trial_will_end
   stripe trigger invoice.payment_succeeded
   stripe trigger customer.subscription.deleted
   ```

### Test Cards

Use these test card numbers for testing:

- Success: `4242424242424242`
- Decline: `4000000000000002`
- Insufficient funds: `4000000000009995`
- Expired card: `4000000000000069`
- Incorrect CVC: `4000000000000127`

## Support

For technical support or questions about the Payment API, please contact the development team or refer to the Stripe documentation for detailed information about Stripe's API.
