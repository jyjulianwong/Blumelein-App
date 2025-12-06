# API Integration Guide

This document explains how the frontend integrates with the Blumelein Server API.

## API Adapter Architecture

All API calls are centralized in `src/api/apiAdapter.js`, which provides a clean interface for making backend requests.

### Configuration

The API base URL is configured in `src/utils/config.js`:

```javascript
const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  stripePublishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
};
```

## Implemented Endpoints

### 1. Submit Order
**Endpoint**: `POST /orders`

**Usage in Code**:
```javascript
import apiAdapter from './api/apiAdapter';

const orderData = {
  items: [
    {
      main_colours: ['red', 'pink'],
      size: 'M',
      comments: 'Please include roses'
    }
  ],
  buyer_full_name: 'Jane Smith',
  delivery_address: '123 Main St, New York, NY 10001'
};

const response = await apiAdapter.submitOrder(orderData);
```

**Where Used**: `src/pages/CheckoutPage.jsx` (Step 1 of checkout)

**Response**: OrderResponse with order_id, items, payment_status, order_status, etc.

### 2. Get Order by ID
**Endpoint**: `GET /orders/{order_id}`

**Usage in Code**:
```javascript
const order = await apiAdapter.getOrderById(orderId);
```

**Where Used**: `src/pages/OrderSummaryPage.jsx` (Fetching order details after payment)

**Response**: Complete order information including all items and status

### 3. Create Payment Intent
**Endpoint**: `POST /payments/create-payment-intent`

**Usage in Code**:
```javascript
const paymentData = {
  order_id: orderResponse.order_id,
  amount: 5000, // Amount in cents ($50.00)
  currency: 'usd'
};

const paymentResponse = await apiAdapter.createPaymentIntent(paymentData);
// Returns: { client_secret, payment_intent_id, amount, currency }
```

**Where Used**: `src/pages/CheckoutPage.jsx` (Step 2 of checkout)

**Response**: PaymentIntentResponse with client_secret for Stripe

## Data Flow

### Order Submission Flow

```
1. User fills out checkout form
   └─> CheckoutPage.jsx

2. Form submits and creates order
   └─> apiAdapter.submitOrder(orderData)
   └─> POST /orders
   └─> Returns { order_id, ... }

3. Create payment intent
   └─> apiAdapter.createPaymentIntent({ order_id, amount, currency })
   └─> POST /payments/create-payment-intent
   └─> Returns { client_secret, ... }

4. User completes payment with Stripe
   └─> PaymentForm.jsx
   └─> Stripe SDK handles payment

5. Redirect to order summary
   └─> OrderSummaryPage.jsx
   └─> apiAdapter.getOrderById(order_id)
   └─> GET /orders/{order_id}
   └─> Display complete order details
```

## Request/Response Schemas

### ItemCreate
```typescript
{
  main_colours: string[];      // Required, min 1 item
  size: "S" | "M" | "L";       // Required
  comments?: string | null;    // Optional, max 500 chars
}
```

### OrderCreate
```typescript
{
  items: ItemCreate[];         // Required, min 1 item
  buyer_full_name: string;     // Required, 1-100 chars
  delivery_address: string;    // Required, 1-300 chars
}
```

### OrderResponse
```typescript
{
  order_id: string;           // UUID
  items: Item[];              // With item_id and created_at
  buyer_full_name: string;
  delivery_address: string;
  payment_status: "Incomplete" | "Completed";
  order_status: "Not Started" | "In Progress" | "Completed";
  created_at: string;         // ISO 8601 datetime
  updated_at: string;         // ISO 8601 datetime
}
```

### PaymentIntent
```typescript
{
  order_id: string;           // UUID
  amount: number;             // In cents, e.g., 5000 = $50.00
  currency?: string;          // Default: "usd"
}
```

### PaymentIntentResponse
```typescript
{
  client_secret: string;      // For Stripe payment
  payment_intent_id: string;  // Stripe payment intent ID
  amount: number;             // In cents
  currency: string;           // e.g., "usd"
}
```

## Error Handling

The API adapter implements comprehensive error handling:

```javascript
async request(endpoint, options = {}) {
  try {
    const response = await fetch(url, fetchOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
}
```

### Usage in Components

```javascript
try {
  const order = await apiAdapter.submitOrder(orderData);
  setOrderId(order.order_id);
} catch (err) {
  console.error('Error submitting order:', err);
  setError(err.message || 'Failed to process order. Please try again.');
}
```

## Price Calculation

The frontend calculates prices based on bouquet size:

```javascript
const SIZES = {
  S: { label: 'Small', price: 35 },
  M: { label: 'Medium', price: 55 },
  L: { label: 'Large', price: 85 },
};
```

When creating a payment intent, prices are converted to cents:

```javascript
const totalInCents = Math.round(calculateTotal() * 100);
```

## CORS Configuration

Ensure your backend API has CORS configured to allow requests from your frontend:

```python
# Example for FastAPI
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Testing API Integration

### 1. Test Health Check

```javascript
import apiAdapter from './src/api/apiAdapter';

// Test API connection
try {
  await apiAdapter.healthCheck();
  console.log('API is healthy');
} catch (error) {
  console.error('API health check failed:', error);
}
```

### 2. Test Order Creation

```javascript
const testOrder = {
  items: [
    {
      main_colours: ['red', 'white'],
      size: 'M',
      comments: 'Test order'
    }
  ],
  buyer_full_name: 'Test User',
  delivery_address: '123 Test St'
};

const order = await apiAdapter.submitOrder(testOrder);
console.log('Order created:', order.order_id);
```

### 3. Test Order Retrieval

```javascript
const orderId = 'your-order-id-here';
const order = await apiAdapter.getOrderById(orderId);
console.log('Order details:', order);
```

## Webhook Integration

The backend handles Stripe webhooks at `POST /payments/webhook`. The frontend doesn't directly interact with this endpoint, but it's important for payment verification.

When a payment succeeds:
1. Stripe sends webhook to backend
2. Backend updates order payment_status to "Completed"
3. Frontend can fetch updated order via `GET /orders/{order_id}`

## Environment Setup for Different Stages

### Development
```bash
VITE_API_BASE_URL=http://localhost:8000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Staging
```bash
VITE_API_BASE_URL=https://api-staging.example.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Production
```bash
VITE_API_BASE_URL=https://api.example.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

## Security Considerations

1. **API Keys**: Never commit actual API keys to version control
2. **HTTPS**: Always use HTTPS in production
3. **Input Validation**: Backend validates all inputs per OpenAPI schema
4. **Payment Security**: Stripe handles sensitive card data (PCI compliant)
5. **CORS**: Configure CORS properly to restrict access to authorized domains

## Extending the API Adapter

To add new endpoints:

```javascript
// In src/api/apiAdapter.js

/**
 * List all orders (admin only)
 * GET /manage/orders
 */
async listAllOrders(apiKey) {
  return this.request('/manage/orders', {
    method: 'GET',
    headers: {
      'X-API-Key': apiKey,
    },
  });
}
```

## Troubleshooting

### Common Issues

**Issue**: "Failed to fetch"
- Check if backend is running
- Verify VITE_API_BASE_URL is correct
- Check browser console for CORS errors

**Issue**: 422 Validation Error
- Verify request payload matches schema
- Check required fields are present
- Ensure data types are correct (string, number, array)

**Issue**: Payment intent creation fails
- Verify order was created successfully first
- Check amount is in cents (integer)
- Ensure Stripe keys are configured on backend

### Debug Mode

Add this to your component for debugging:

```javascript
useEffect(() => {
  console.log('API Base URL:', config.apiBaseUrl);
  console.log('Stripe Key:', config.stripePublishableKey.substring(0, 10) + '...');
}, []);
```

## Performance Optimization

### Caching Strategy
- Order details can be cached after retrieval
- Basket data is stored in localStorage
- Consider implementing React Query for caching

### Request Optimization
- Batch requests where possible
- Implement request debouncing for search/filter features
- Use loading states to improve perceived performance

## Future Enhancements

Potential API integrations to consider:

1. **Order Updates**: Real-time status updates via WebSocket
2. **Order History**: User account and order history
3. **Inventory Check**: Check flower availability before order
4. **Delivery Tracking**: Integration with delivery service API
5. **Email Notifications**: Confirmation and status update emails


