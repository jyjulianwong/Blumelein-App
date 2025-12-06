# Blumelein App - Architecture Documentation

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser (Frontend)                      │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    React Application                      │  │
│  │                                                           │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐        │  │
│  │  │ Home Page  │  │Basket Page │  │Checkout    │        │  │
│  │  │            │  │            │  │Page        │        │  │
│  │  └─────┬──────┘  └──────┬─────┘  └──────┬─────┘        │  │
│  │        │                │               │              │  │
│  │        └────────────────┴───────────────┘              │  │
│  │                         │                               │  │
│  │                         ▼                               │  │
│  │              ┌──────────────────────┐                  │  │
│  │              │  BasketContext       │                  │  │
│  │              │  (Global State)      │                  │  │
│  │              └──────────┬───────────┘                  │  │
│  │                         │                               │  │
│  │           ┌─────────────┴─────────────┐                │  │
│  │           ▼                           ▼                │  │
│  │  ┌────────────────────┐    ┌────────────────────┐    │  │
│  │  │ Browser Storage    │    │  Server API        │    │  │
│  │  │ Adapter            │    │  Adapter           │    │  │
│  │  │ (localStorage)     │    │  (Backend API)     │    │  │
│  │  └────────────────────┘    └──────────┬─────────┘    │  │
│  │                         │                               │  │
│  └─────────────────────────┼───────────────────────────────┘  │
│                            │                                  │
└────────────────────────────┼──────────────────────────────────┘
                             │
                             ▼
              ┌──────────────────────────┐
              │   Backend API Server     │
              │   (Your FastAPI Backend) │
              │                          │
              │  ┌────────────────────┐  │
              │  │ POST /orders       │  │
              │  │ GET /orders/{id}   │  │
              │  │ POST /payments/... │  │
              │  └────────────────────┘  │
              └──────────┬───────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │   External Services  │
              │                      │
              │  ┌────────────────┐  │
              │  │ Stripe Payment │  │
              │  │ Processing     │  │
              │  └────────────────┘  │
              │                      │
              │  ┌────────────────┐  │
              │  │ Database       │  │
              │  │ (Orders)       │  │
              │  └────────────────┘  │
              └──────────────────────┘
```

## Component Hierarchy

```
App
├── BasketProvider (Context)
│   └── Router
│       ├── Header (on all pages)
│       │   ├── Logo/Title
│       │   └── Navigation
│       │       ├── Create Bouquet Link
│       │       └── Basket Link (with count badge)
│       │
│       └── Routes
│           ├── HomePage (/)
│           │   └── ItemConfigurator
│           │       ├── Size Selection
│           │       ├── Color Selection
│           │       ├── Comments Input
│           │       └── Add to Basket Button
│           │
│           ├── BasketPage (/basket)
│           │   ├── BasketItem (for each item)
│           │   │   ├── Item Details
│           │   │   ├── Price
│           │   │   └── Remove Button
│           │   └── Order Summary Sidebar
│           │       ├── Price Breakdown
│           │       └── Checkout Button
│           │
│           ├── CheckoutPage (/checkout)
│           │   ├── Progress Indicator
│           │   ├── Step 1: Details Form
│           │   │   ├── Full Name Input
│           │   │   ├── Email Input
│           │   │   ├── Phone Input
│           │   │   ├── Address Input
│           │   │   └── Continue Button
│           │   ├── Step 2: Payment
│           │   │   └── PaymentForm (Stripe)
│           │   │       ├── Card Element
│           │   │       └── Submit Button
│           │   └── Order Summary Sidebar
│           │
│           └── OrderSummaryPage (/order-summary/:orderId)
│               ├── Success Message
│               ├── Order Details
│               ├── Delivery Info
│               ├── Items List
│               ├── Price Breakdown
│               └── Action Buttons
```

## Data Flow

### Adding Item to Basket

```
User Action (ItemConfigurator)
    │
    ├─> Validate inputs
    │   └─> Size selected? ✓
    │   └─> At least 1 color? ✓
    │
    ├─> Create item object
    │   {
    │     size: "M",
    │     main_colours: ["red", "pink"],
    │     comments: "Include roses"
    │   }
    │
    ├─> addItem() from BasketContext
    │   │
    │   ├─> Add unique ID and timestamp
    │   ├─> Update items array in state
    │   └─> Save to localStorage
    │
    └─> Show success message
```

### Checkout & Payment Flow

```
1. User clicks "Proceed to Checkout"
   │
   ├─> Navigate to /checkout
   │
   ├─> Step 1: Enter Details
   │   ├─> User fills form
   │   ├─> Click "Continue to Payment"
   │   │
   │   ├─> Validate inputs
   │   │
   │   ├─> API Call: submitOrder()
   │   │   POST /orders
   │   │   {
   │   │     items: [...],
   │   │     buyer_full_name: "...",
   │   │     buyer_email: "...",
   │   │     buyer_phone: "...",
   │   │     delivery_address: "..."
   │   │   }
   │   │   │
   │   │   └─> Response: { order_id, ... }
   │   │
   │   ├─> API Call: createPaymentIntent()
   │   │   POST /payments/create-payment-intent
   │   │   {
   │   │     order_id: "...",
   │   │     amount: 5500,  // in cents
   │   │     currency: "usd"
   │   │   }
   │   │   │
   │   │   └─> Response: { client_secret, ... }
   │   │
   │   └─> Move to Step 2
   │
   └─> Step 2: Payment
       ├─> Load Stripe Elements with client_secret
       ├─> User enters card details
       ├─> Click "Complete Payment"
       │
       ├─> Stripe processes payment
       │   └─> Success: payment_intent.status = "succeeded"
       │
       ├─> Clear basket (clearBasket())
       │
       └─> Navigate to /order-summary/:orderId
           │
           ├─> API Call: getOrderById()
           │   GET /orders/{order_id}
           │   │
           │   └─> Response: Complete order details
           │
           └─> Display order summary
```

## State Management

### BasketContext State

```javascript
{
  items: [
    {
      id: "1234567890-0.123",        // Generated locally
      size: "M",
      main_colours: ["red", "pink"],
      comments: "Include roses",
      createdAt: "2024-01-01T12:00:00Z"
    },
    // ... more items
  ]
}
```

### BasketContext Methods

```javascript
const BasketContext = {
  // State
  items: [],
  
  // Methods
  addItem: (item) => {
    // Add unique ID and timestamp
    // Update state
    // Save to storage via browserStorageAdapter
  },
  
  removeItem: (itemId) => {
    // Remove from state
    // Update storage via browserStorageAdapter
  },
  
  updateItem: (itemId, data) => {
    // Update item in state
    // Update storage via browserStorageAdapter
  },
  
  clearBasket: () => {
    // Clear state
    // Clear storage via browserStorageAdapter.remove()
  },
  
  getItemCount: () => {
    // Return items.length
  }
};
```

## API Integration

### Adapter Pattern

The application uses the **Adapter Pattern** to provide consistent interfaces for external interactions:

#### Server API Adapter
Located in `src/adapters/serverApiAdapter.js`, this handles all backend HTTP requests.

```javascript
class ServerApiAdapter {
  constructor() {
    this.baseUrl = config.serverApiBaseUrl;
  }
  
  async request(endpoint, options) {
    // Generic fetch wrapper
    // Error handling
    // Response parsing
  }
  
  async submitOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  }
  
  async getOrderById(orderId) {
    return this.request(`/orders/${orderId}`, {
      method: 'GET'
    });
  }
  
  async createPaymentIntent(paymentData) {
    return this.request('/payments/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify(paymentData)
    });
  }
}

export default new ServerApiAdapter();  // Singleton
```

#### Browser Storage Adapter
Located in `src/adapters/browserStorageAdapter.js`, this handles all browser storage operations.

```javascript
class BrowserStorageAdapter {
  constructor(storageType = 'localStorage') {
    this.storage = storageType === 'sessionStorage' 
      ? sessionStorage 
      : localStorage;
  }
  
  get(key, defaultValue = null) {
    // Retrieves and parses JSON data
    // Error handling for invalid JSON
    // Returns defaultValue if key doesn't exist
  }
  
  set(key, value) {
    // Stringifies and stores data
    // Error handling for quota exceeded
    // Returns success status
  }
  
  remove(key) {
    // Removes item from storage
    // Error handling
  }
  
  has(key) {
    // Check if key exists
  }
  
  clear() {
    // Clear all storage
  }
}

export default new BrowserStorageAdapter('localStorage');  // Singleton
```

**Benefits of Adapter Pattern:**
- Centralizes external interactions
- Easy to mock for testing
- Consistent error handling
- Simple to swap implementations (e.g., localStorage → IndexedDB)
- Type-safe interface for storage operations

## Configuration Management

### Environment Variables Flow

```
.env file
    │
    ├─> VITE_SERVER_API_BASE_URL=http://localhost:8000
    └─> VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
    │
    ▼
Vite Build Process
    │
    └─> import.meta.env.VITE_*
    │
    ▼
src/config.js
    │
    ├─> const config = {
    │     serverApiBaseUrl: import.meta.env.VITE_SERVER_API_BASE_URL,
    │     stripePublishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
    │   }
    │
    ▼
Used throughout application
    │
    ├─> API Adapter (serverApiBaseUrl)
    └─> Stripe initialization (stripePublishableKey)
```

## Routing Structure

```
Routes Configuration
    │
    ├─> / (Root)
    │   └─> HomePage
    │       └─> ItemConfigurator
    │
    ├─> /basket
    │   └─> BasketPage
    │       ├─> BasketItem (repeated)
    │       └─> Order Summary
    │
    ├─> /checkout
    │   └─> CheckoutPage
    │       ├─> Step 1: Details Form
    │       └─> Step 2: PaymentForm
    │
    └─> /order-summary/:orderId
        └─> OrderSummaryPage
            └─> Fetches order by ID from URL
```

## Styling Architecture

### Tailwind CSS Approach

```
tailwind.config.js
    │
    ├─> Custom Theme
    │   └─> colors.primary (pink shades)
    │
    ▼
Components use Tailwind classes
    │
    ├─> Utility-first approach
    ├─> Responsive modifiers (sm:, md:, lg:)
    ├─> State modifiers (hover:, focus:, disabled:)
    └─> Custom color classes (bg-primary-600, text-primary-500)
    │
    ▼
Build Process
    │
    └─> PurgeCSS removes unused classes
    └─> Output: Minimal CSS file (~4KB gzipped)
```

## Security Architecture

### Frontend Security Layers

```
1. Configuration Security
   ├─> .env not committed (in .gitignore)
   ├─> No hardcoded secrets
   └─> Environment-specific configs

2. Input Validation
   ├─> Form validation before submission
   ├─> Max length constraints
   └─> Required field checks

3. API Communication
   ├─> HTTPS in production (recommended)
   ├─> CORS headers from backend
   └─> Error handling without exposing internals

4. Payment Security
   ├─> Stripe handles sensitive data
   ├─> PCI compliance through Stripe
   ├─> No card data stored locally
   └─> Tokenization for payments

5. XSS Protection
   ├─> React escapes output by default
   ├─> No dangerouslySetInnerHTML used
   └─> User input sanitized
```

## Performance Architecture

### Optimization Strategy

```
1. Code Splitting
   ├─> Route-based splitting (React Router)
   ├─> Lazy loading of Stripe components
   └─> Dynamic imports where beneficial

2. Asset Optimization
   ├─> CSS purging (Tailwind)
   ├─> JS minification (Vite)
   ├─> Tree shaking (Vite)
   └─> Gzip compression

3. Caching Strategy
   ├─> browserStorageAdapter for basket (localStorage)
   ├─> Browser caching for static assets
   └─> Consider React Query for API caching

4. Load Performance
   ├─> Vite dev server (instant HMR)
   ├─> Small bundle size (~68KB gzipped)
   └─> Fast initial render
```

## Error Handling Architecture

### Error Flow

```
Component/API Call
    │
    ├─> Try/Catch Block
    │   │
    │   ├─> Success Path
    │   │   └─> Update state
    │   │   └─> Show success feedback
    │   │
    │   └─> Error Path
    │       ├─> Log to console (development)
    │       ├─> Set error state
    │       └─> Show user-friendly message
    │
    └─> User sees:
        ├─> Loading state (during request)
        ├─> Success state (on success)
        └─> Error state (on failure)
```

### Error Boundaries (Recommended)

```jsx
// Future enhancement
<ErrorBoundary fallback={<ErrorPage />}>
  <App />
</ErrorBoundary>
```

## Build & Deploy Architecture

### Build Process

```
Development
    │
    ├─> npm run dev
    │   └─> Vite dev server
    │   └─> Hot Module Replacement (HMR)
    │   └─> Fast refresh
    │
Production
    │
    ├─> npm run build
    │   │
    │   ├─> Load environment variables
    │   ├─> Transpile JSX → JS
    │   ├─> Bundle modules
    │   ├─> Minify code
    │   ├─> Purge unused CSS
    │   ├─> Generate source maps
    │   └─> Output to dist/
    │
    └─> dist/
        ├─> index.html
        ├─> assets/
        │   ├─> index-[hash].js
        │   └─> index-[hash].css
        └─> vite.svg
```

### Deployment Flow

```
Local Development
    │
    └─> Git commit & push
    │
    ▼
Hosting Platform (Vercel/Netlify/etc.)
    │
    ├─> Pull code
    ├─> Install dependencies (npm install)
    ├─> Load environment variables
    ├─> Build (npm run build)
    └─> Deploy dist/ folder
    │
    ▼
Production URL
    │
    └─> Users access application
```

## Testing Architecture (Recommended)

```
Unit Tests (Jest + React Testing Library)
    │
    ├─> Component tests
    ├─> Utility function tests
    └─> Context tests

Integration Tests
    │
    ├─> API adapter tests
    ├─> Form submission tests
    └─> Routing tests

E2E Tests (Cypress/Playwright)
    │
    ├─> Complete purchase flow
    ├─> Basket management
    └─> Payment processing
```

## Monitoring Architecture (Recommended)

```
Production Monitoring
    │
    ├─> Error Tracking
    │   └─> Sentry, LogRocket, etc.
    │
    ├─> Analytics
    │   └─> Google Analytics, Mixpanel, etc.
    │
    ├─> Performance
    │   └─> Web Vitals, Lighthouse
    │
    └─> User Behavior
        └─> Heatmaps, session recordings
```

## Scalability Considerations

### Current Architecture Supports

- ✅ Unlimited products (currently 3 sizes, 8 colors - easily extensible)
- ✅ Large basket sizes (no technical limit)
- ✅ High traffic (static frontend, CDN-ready)
- ✅ Multiple environments (dev, staging, prod)

### Future Scaling Options

1. **Backend Caching**: Redis for frequently accessed orders
2. **CDN**: CloudFlare or similar for static assets
3. **Database Optimization**: Indexing, query optimization
4. **Load Balancing**: Multiple backend instances
5. **Microservices**: Separate payment, order, notification services

## Maintenance Architecture

### Regular Updates

```
Dependencies
    │
    ├─> Weekly: npm outdated
    ├─> Monthly: npm update
    └─> Security: npm audit

Code Quality
    │
    ├─> ESLint on pre-commit
    ├─> Prettier for formatting
    └─> Code reviews

Monitoring
    │
    ├─> Error rates
    ├─> Performance metrics
    └─> User feedback
```

## Summary

The Blumelein app uses a modern, scalable architecture with:

- **Component-based UI** (React)
- **Centralized state** (Context API)
- **Adapter pattern** (API Adapter + Storage Adapter)
- **Environment-based config** (.env + config.js)
- **Modern tooling** (Vite, Tailwind)
- **Secure payments** (Stripe)
- **Production-ready** (Build, deploy, monitor)

This architecture provides a solid foundation for a production e-commerce application with room for growth and enhancement.


