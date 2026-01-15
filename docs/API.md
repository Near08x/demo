# API Reference

Complete API documentation for the Business Management System REST endpoints.

## Table of Contents

1. [Authentication](#authentication)
2. [Loans API](#loans-api)
3. [Sales API](#sales-api)
4. [Products API](#products-api)
5. [Clients API](#clients-api)
6. [Users API](#users-api)
7. [Error Handling](#error-handling)
8. [Rate Limiting](#rate-limiting)

---

## Authentication

### Overview

The API uses **JWT tokens** stored in **HttpOnly Secure Cookies**. Authentication is automatic when accessing authenticated endpoints.

### Login

Creates a new session and returns a JWT token in an HttpOnly cookie.

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "demo@example.com",
  "password": "DemoPassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": "user-123",
    "email": "demo@example.com",
    "role": "admin",
    "created_at": "2024-01-01T00:00:00Z"
  },
  "redirectUrl": "/"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Invalid email or password"
}
```

### Logout

Clears the authentication cookie and destroys the session.

```http
POST /api/auth/logout
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Get Current User

Retrieves information about the currently authenticated user.

```http
GET /api/auth/me
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "id": "user-123",
  "email": "demo@example.com",
  "role": "admin",
  "name": "Demo User",
  "created_at": "2024-01-01T00:00:00Z"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Not authenticated"
}
```

### Authentication Headers

For API calls that require authentication, include the JWT token:

```http
Cookie: jwt={token}
```

Or use the Authorization header:

```http
Authorization: Bearer {token}
```

---

## Loans API

### Overview

Manage customer loans with installment calculations, payment tracking, and financial analytics.

### List All Loans

Retrieve all loans with optional filtering and pagination.

```http
GET /api/loans?status=active&client_id=abc123&limit=10&offset=0
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by status: `active`, `completed`, `defaulted` |
| `client_id` | string | Filter by client UUID |
| `limit` | number | Results per page (default: 20, max: 100) |
| `offset` | number | Results offset for pagination (default: 0) |

**Response (200 OK):**
```json
{
  "loans": [
    {
      "id": "loan-123",
      "client_id": "client-456",
      "client_name": "John Smith",
      "amount": 1000,
      "currency": "USD",
      "term": 12,
      "interest_rate": 5,
      "status": "active",
      "created_at": "2024-01-01T00:00:00Z",
      "due_date": "2025-01-01T00:00:00Z",
      "installments": [
        {
          "id": "inst-1",
          "installment_number": 1,
          "due_date": "2024-02-01T00:00:00Z",
          "principal": 83.33,
          "interest": 4.17,
          "paid": 83.33,
          "late_fee": 0,
          "status": "paid"
        }
      ]
    }
  ],
  "total": 45,
  "limit": 20,
  "offset": 0
}
```

### Get Loan Details

Retrieve detailed information about a specific loan.

```http
GET /api/loans/loan-123
```

**Response (200 OK):**
```json
{
  "id": "loan-123",
  "client_id": "client-456",
  "client": {
    "id": "client-456",
    "name": "John Smith",
    "email": "john@example.com",
    "phone": "+1-555-0100"
  },
  "amount": 1000,
  "currency": "USD",
  "term": 12,
  "interest_rate": 5,
  "status": "active",
  "total_paid": 166.66,
  "remaining_balance": 833.34,
  "overdue_amount": 0,
  "created_at": "2024-01-01T00:00:00Z",
  "due_date": "2025-01-01T00:00:00Z",
  "installments": [
    {
      "id": "inst-1",
      "installment_number": 1,
      "due_date": "2024-02-01T00:00:00Z",
      "principal": 83.33,
      "interest": 4.17,
      "paid": 83.33,
      "late_fee": 0,
      "status": "paid"
    },
    {
      "id": "inst-2",
      "installment_number": 2,
      "due_date": "2024-03-01T00:00:00Z",
      "principal": 83.34,
      "interest": 4.16,
      "paid": 83.34,
      "late_fee": 0,
      "status": "paid"
    }
  ]
}
```

### Create Loan

Create a new loan with automatic installment calculation.

```http
POST /api/loans
Content-Type: application/json

{
  "client_id": "client-456",
  "amount": 1000,
  "term": 12,
  "interest_rate": 5,
  "frequency": "monthly",
  "start_date": "2024-01-01"
}
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `client_id` | string | Yes | UUID of the client |
| `amount` | number | Yes | Loan amount in dollars |
| `term` | number | Yes | Loan duration in periods (1-60) |
| `interest_rate` | number | Yes | Annual interest rate (0-100) |
| `frequency` | string | Yes | Payment frequency: `weekly`, `biweekly`, `monthly` |
| `start_date` | string | No | ISO 8601 date (default: today) |

**Response (201 Created):**
```json
{
  "id": "loan-789",
  "client_id": "client-456",
  "amount": 1000,
  "term": 12,
  "interest_rate": 5,
  "status": "active",
  "total_interest": 50.00,
  "monthly_payment": 87.50,
  "created_at": "2024-01-14T10:30:00Z",
  "due_date": "2025-01-14T00:00:00Z",
  "installments_count": 12
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Validation failed",
  "details": {
    "amount": "Amount must be greater than 0",
    "term": "Term must be between 1 and 60"
  }
}
```

### Make Payment

Record a payment on a loan. Payment is automatically distributed across installments.

```http
PATCH /api/loans/loan-123
Content-Type: application/json

{
  "amount": 200,
  "payment_method": "cash",
  "notes": "Partial payment"
}
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `amount` | number | Yes | Payment amount |
| `payment_method` | string | No | `cash`, `check`, `card`, `transfer` |
| `notes` | string | No | Additional notes |

**Response (200 OK):**
```json
{
  "success": true,
  "loan_id": "loan-123",
  "payment": {
    "id": "payment-999",
    "amount": 200,
    "applied_to": [
      {
        "installment_number": 1,
        "amount": 87.50
      },
      {
        "installment_number": 2,
        "amount": 87.50
      },
      {
        "installment_number": 3,
        "amount": 25.00
      }
    ],
    "remaining_balance": 633.34,
    "created_at": "2024-01-14T11:00:00Z"
  }
}
```

### Update Loan

Update loan details (status, interest rate, etc).

```http
PUT /api/loans/loan-123
Content-Type: application/json

{
  "status": "completed",
  "interest_rate": 4.5
}
```

**Response (200 OK):**
```json
{
  "id": "loan-123",
  "status": "completed",
  "interest_rate": 4.5,
  "updated_at": "2024-01-14T11:15:00Z"
}
```

### Delete Loan

Delete a loan (only if status is pending).

```http
DELETE /api/loans/loan-123
```

**Response (204 No Content):**
```
(empty response)
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Cannot delete loan with status: active"
}
```

---

## Sales API

### List Sales

Retrieve sales transactions with filtering and pagination.

```http
GET /api/sales?start_date=2024-01-01&end_date=2024-01-31&limit=50
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `start_date` | string | ISO 8601 start date |
| `end_date` | string | ISO 8601 end date |
| `customer` | string | Filter by customer name |
| `status` | string | `completed`, `pending`, `cancelled` |
| `limit` | number | Results per page (default: 20) |
| `offset` | number | Pagination offset |

**Response (200 OK):**
```json
{
  "sales": [
    {
      "id": "sale-123",
      "transaction_number": "TXN-001",
      "customer": "General Customer",
      "items": [
        {
          "product_id": "prod-456",
          "product_name": "Smartphone X12",
          "quantity": 1,
          "unit_price": 899.99,
          "subtotal": 899.99
        }
      ],
      "subtotal": 899.99,
      "tax": 53.39,
      "total": 953.38,
      "payment_method": "cash",
      "status": "completed",
      "created_at": "2024-01-14T10:00:00Z"
    }
  ],
  "total": 156,
  "summary": {
    "total_sales": 15000.00,
    "total_tax": 891.00,
    "transactions": 156
  }
}
```

### Create Sale

Process a new sale transaction.

```http
POST /api/sales
Content-Type: application/json

{
  "customer": "John Doe",
  "items": [
    {
      "product_id": "prod-456",
      "quantity": 2,
      "price_tier": "P1"
    }
  ],
  "payment_method": "cash",
  "discount_percent": 5
}
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `customer` | string | Yes | Customer name |
| `items` | array | Yes | Array of items in sale |
| `items[].product_id` | string | Yes | Product UUID |
| `items[].quantity` | number | Yes | Quantity sold |
| `items[].price_tier` | string | Yes | `P1`, `P2`, or `P3` |
| `payment_method` | string | No | Payment method |
| `discount_percent` | number | No | Discount percentage (0-100) |

**Response (201 Created):**
```json
{
  "id": "sale-456",
  "transaction_number": "TXN-002",
  "customer": "John Doe",
  "items": [
    {
      "product_id": "prod-456",
      "product_name": "Smartphone X12",
      "quantity": 2,
      "unit_price": 899.99,
      "subtotal": 1799.98
    }
  ],
  "subtotal": 1799.98,
  "discount": 89.99,
  "subtotal_after_discount": 1709.99,
  "tax": 101.60,
  "total": 1811.59,
  "payment_method": "cash",
  "receipt_url": "/api/sales/456/receipt",
  "created_at": "2024-01-14T10:15:00Z"
}
```

---

## Products API

### List Products

Retrieve products from inventory.

```http
GET /api/products?status=in_stock&category=electronics&limit=50
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | `in_stock`, `low_stock`, `out_of_stock` |
| `category` | string | Product category |
| `search` | string | Search by name or SKU |
| `limit` | number | Results per page |

**Response (200 OK):**
```json
{
  "products": [
    {
      "id": "prod-123",
      "name": "Smartphone X12",
      "sku": "SMX12-001",
      "category": "Electronics",
      "description": "Latest smartphone model",
      "prices": {
        "P1_retail": 899.99,
        "P2_wholesale": 0.00,
        "P3_sale": 0.00
      },
      "cost": 650.00,
      "stock": 30,
      "status": "in_stock",
      "reorder_level": 10,
      "provider": "Samsung",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 6
}
```

### Get Product Details

```http
GET /api/products/prod-123
```

**Response (200 OK):**
```json
{
  "id": "prod-123",
  "name": "Smartphone X12",
  "sku": "SMX12-001",
  "category": "Electronics",
  "description": "Latest smartphone model with advanced camera",
  "prices": {
    "P1_retail": 899.99,
    "P2_wholesale": 0.00,
    "P3_sale": 0.00
  },
  "cost": 650.00,
  "stock": 30,
  "status": "in_stock",
  "reorder_level": 10,
  "provider": "Samsung",
  "stock_history": [
    {
      "date": "2024-01-10T00:00:00Z",
      "change": 10,
      "type": "restock"
    }
  ],
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-14T00:00:00Z"
}
```

### Create Product

Add a new product to inventory.

```http
POST /api/products
Content-Type: application/json

{
  "name": "Laptop Pro 15\"",
  "sku": "LPP15-001",
  "category": "Computers",
  "description": "Professional laptop",
  "prices": {
    "P1_retail": 1299.99,
    "P2_wholesale": 0,
    "P3_sale": 0
  },
  "cost": 899.00,
  "stock": 25,
  "reorder_level": 5,
  "provider": "Apple"
}
```

**Response (201 Created):**
```json
{
  "id": "prod-789",
  "name": "Laptop Pro 15\"",
  "sku": "LPP15-001",
  "created_at": "2024-01-14T10:30:00Z"
}
```

### Update Product

```http
PUT /api/products/prod-123
Content-Type: application/json

{
  "stock": 25,
  "prices": {
    "P1_retail": 849.99
  }
}
```

**Response (200 OK):**
```json
{
  "id": "prod-123",
  "stock": 25,
  "prices": {
    "P1_retail": 849.99
  },
  "updated_at": "2024-01-14T10:45:00Z"
}
```

### Delete Product

```http
DELETE /api/products/prod-123
```

**Response (204 No Content):**
```
(empty response)
```

---

## Clients API

### List Clients

```http
GET /api/clients?search=john&limit=20
```

**Response (200 OK):**
```json
{
  "clients": [
    {
      "id": "client-123",
      "name": "John Smith",
      "email": "john@example.com",
      "phone": "+1-555-0100",
      "address": "123 Main St",
      "city": "New York",
      "state": "NY",
      "total_purchases": 5000.00,
      "total_due": 1000.00,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 45
}
```

### Get Client Details

```http
GET /api/clients/client-123
```

**Response (200 OK):**
```json
{
  "id": "client-123",
  "name": "John Smith",
  "email": "john@example.com",
  "phone": "+1-555-0100",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "contact_person": "John Smith",
  "total_purchases": 5000.00,
  "total_due": 1000.00,
  "credit_limit": 5000.00,
  "payment_terms": "net30",
  "active_loans": [
    {
      "id": "loan-123",
      "amount": 1000.00,
      "remaining_balance": 500.00,
      "status": "active"
    }
  ],
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Create Client

```http
POST /api/clients
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+1-555-0101",
  "address": "456 Oak Ave",
  "city": "Boston",
  "state": "MA",
  "credit_limit": 10000
}
```

**Response (201 Created):**
```json
{
  "id": "client-456",
  "name": "Jane Doe",
  "created_at": "2024-01-14T10:30:00Z"
}
```

### Update Client

```http
PUT /api/clients/client-123
Content-Type: application/json

{
  "phone": "+1-555-0199",
  "credit_limit": 7500
}
```

**Response (200 OK):**
```json
{
  "id": "client-123",
  "phone": "+1-555-0199",
  "credit_limit": 7500,
  "updated_at": "2024-01-14T10:45:00Z"
}
```

### Delete Client

```http
DELETE /api/clients/client-123
```

**Response (204 No Content):**
```
(empty response)
```

---

## Users API

### List Users

```http
GET /api/users?role=cashier&limit=10
```

**Response (200 OK):**
```json
{
  "users": [
    {
      "id": "user-123",
      "email": "demo@example.com",
      "role": "admin",
      "name": "Demo User",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 5
}
```

### Create User

```http
POST /api/users
Content-Type: application/json

{
  "email": "cashier@example.com",
  "password": "SecurePassword123",
  "name": "Cashier User",
  "role": "cashier"
}
```

**Response (201 Created):**
```json
{
  "id": "user-789",
  "email": "cashier@example.com",
  "name": "Cashier User",
  "role": "cashier",
  "created_at": "2024-01-14T10:30:00Z"
}
```

---

## Error Handling

All errors follow a consistent format:

### 400 Bad Request

```json
{
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": {
    "field_name": "error message"
  }
}
```

### 401 Unauthorized

```json
{
  "error": "Not authenticated",
  "code": "UNAUTHORIZED"
}
```

### 403 Forbidden

```json
{
  "error": "Insufficient permissions",
  "code": "FORBIDDEN"
}
```

### 404 Not Found

```json
{
  "error": "Resource not found",
  "code": "NOT_FOUND"
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal server error",
  "code": "INTERNAL_ERROR",
  "message": "Something went wrong"
}
```

---

## Rate Limiting

API requests are rate limited to prevent abuse:

```
Rate Limit: 100 requests per minute per IP
```

When rate limit is exceeded, you receive:

```http
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1705238400
```

```json
{
  "error": "Rate limit exceeded",
  "code": "RATE_LIMITED",
  "retry_after": 60
}
```

---

## Testing the API

### Using cURL

```bash
# Login
curl -X POST https://demo-lyart-zeta-92.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@example.com",
    "password": "DemoPassword123"
  }'

# Get loans
curl -X GET "https://demo-lyart-zeta-92.vercel.app/api/loans?limit=10" \
  -H "Cookie: jwt={token}"
```

### Using Postman

1. Import this collection into Postman
2. Set environment variable: `BASE_URL = https://demo-lyart-zeta-92.vercel.app`
3. Run requests in sequence (login first)

### Using JavaScript/Fetch

```javascript
// Login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'demo@example.com',
    password: 'DemoPassword123'
  }),
  credentials: 'include' // Include cookies
});

// Get loans
const loansResponse = await fetch('/api/loans?limit=10', {
  headers: { 'Authorization': `Bearer ${token}` },
  credentials: 'include'
});

const loans = await loansResponse.json();
```

---

**For more information:**
- [Architecture Guide](./ARCHITECTURE.md)
- [Security Guide](../SECURITY.md)
- [README](../README.md)
