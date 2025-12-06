# Blumelein App

A beautiful and modern flower shop web application built with React, Tailwind CSS, and Stripe payment integration.

## 📑 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Configuration](#configuration)
- [User Flow](#user-flow)
- [Pricing](#pricing)
- [Payment Testing](#payment-testing)
- [Design System](#design-system)
- [Accessibility](#accessibility)
- [Security](#security)
- [Troubleshooting](#troubleshooting)
- [Deployment](#deployment)
- [Future Enhancements](#future-enhancements)

## Overview

Blumelein is a complete e-commerce flower shop web application with custom bouquet building, shopping basket, Stripe payment integration, and order management. The app provides a seamless user experience from browsing to payment confirmation.

### Key Highlights

- ✨ Beautiful, modern UI with gradients
- 🎨 8 color options for custom bouquets
- 💾 Basket persists across sessions
- 📱 Fully responsive design
- ♿ WCAG 2.1 AA accessibility compliant
- 🔒 Secure payment processing via Stripe
- ✅ Clear success/error feedback
- 🏗️ Clean, modular architecture

## Features

### 1. Custom Bouquet Builder 🌸

**Location**: Home Page (`/`)

Configure personalized bouquets with multiple options:

- **Size Selection**: Choose from Small ($35), Medium ($55), or Large ($85)
- **Color Selection**: Multiple color picker with 8 options (Red, Pink, White, Yellow, Orange, Purple, Blue, Lavender)
- **Comments Field**: Up to 500 characters for special requests
- **Real-time Pricing**: Shows price based on selected size
- **Visual Feedback**: Selected options highlighted with primary color theme
- **Add to Basket**: One-click addition with success notification

**User Experience**:
- Responsive cards for size selection
- Color swatches with visual indicators
- Character counter for comments
- Success message after adding to basket
- Form resets after successful addition

### 2. Shopping Basket 🛒

**Location**: Basket Page (`/basket`)

Manage your order with full control:

- **Item List**: View all added bouquets with details
- **Item Management**: Remove individual items with confirmation
- **Expandable Comments**: Toggle to view special requests
- **Price Breakdown**: Subtotal, delivery (FREE), and total
- **Order Summary**: Sticky sidebar with pricing details
- **Empty State**: Helpful message when basket is empty
- **Trust Indicators**: Security badges (Secure Payment, Free Delivery, Freshness Guaranteed)
- **Persistent Storage**: Uses browserStorageAdapter (localStorage) to save basket between sessions

**User Experience**:
- Visual item cards with bouquet emoji
- Color tags for selected colours
- Real-time total calculation
- Easy navigation to continue shopping or checkout
- Confirmation dialog before removing items

### 3. Checkout Process 💳

**Location**: Checkout Page (`/checkout`)

Two-step secure checkout process:

#### Step 1: Delivery Details
- **Full Name**: Required field (1-100 characters)
- **Email Address**: Required field with validation (3-254 characters)
- **Phone Number**: International phone input with country selector and validation
  - Country selector with flags
  - Real-time phone number validation
  - Format validation based on selected country
  - Supports all international phone formats
- **Delivery Address**: Required textarea (1-300 characters)
- **Order Summary**: Sidebar with complete pricing
- **Validation**: Client-side validation before proceeding

#### Step 2: Payment
- **Stripe Integration**: Secure payment form using Stripe Elements
- **Payment Methods**: Cards, Apple Pay, Google Pay (based on Stripe configuration)
- **Loading States**: Clear processing indicators
- **Error Handling**: User-friendly error messages
- **Security Badge**: "Secured by Stripe" indicator

**User Experience**:
- Progress indicator (1 of 2, 2 of 2)
- Back button to edit details
- Disabled states during processing
- Order summary visible throughout
- Clear total amount display

### 4. Order Confirmation ✅

**Location**: Order Summary Page (`/order-summary/:orderId`)

Complete order details after payment:

- **Success Animation**: Green checkmark with confirmation message
- **Order Details**: 
  - Order ID (UUID)
  - Order date and time
  - Payment status badge
  - Order processing status badge
- **Delivery Information**: 
  - Recipient name
  - Delivery address
- **Item Details**:
  - All bouquets with sizes
  - Selected colours (as tags)
  - Special requests/comments
  - Individual and total pricing
- **Price Breakdown**: Subtotal, delivery (FREE), total paid
- **Action Buttons**:
  - Create Another Bouquet (returns to home)
  - Print Order Summary (print-friendly)
- **Next Steps Guide**: Information box about what happens next

## Tech Stack

- **Frontend**: React 18, React Router DOM
- **Styling**: Tailwind CSS
- **Payment**: Stripe (@stripe/react-stripe-js, @stripe/stripe-js)
- **Phone Validation**: react-phone-number-input (with libphonenumber-js)
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Payment**: Stripe (React Stripe.js)
- **Build Tool**: Vite
- **State Management**: React Context API

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Stripe account (test mode)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Blumelein-App
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Copy `.env.example` to `.env` and update with your values:

```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_CLIENT_BASE_PATH=/Blumelein-App
VITE_SERVER_API_BASE_URL=http://localhost:8000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key_here
```

> **Important**: Get your Stripe publishable key from [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys). Make sure it starts with `pk_test_` (not `sk_test_`).

4. **Start the development server**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

5. **Build for production**
```bash
npm run build
```

## Project Structure

```
Blumelein-App/
├── src/
│   ├── adapters/
│   │   ├── serverApiAdapter.js    # Centralized API client
│   │   └── browserStorageAdapter.js # Browser storage operations
│   ├── components/
│   │   ├── Header.jsx             # Navigation header
│   │   ├── ItemConfigurator.jsx   # Bouquet configuration form
│   │   ├── BasketItem.jsx         # Individual basket item
│   │   └── PaymentForm.jsx        # Stripe payment form
│   ├── context/
│   │   └── BasketContext.jsx      # Shopping basket state management
│   ├── pages/
│   │   ├── HomePage.jsx           # Landing page with configurator
│   │   ├── BasketPage.jsx         # Shopping basket view
│   │   ├── CheckoutPage.jsx       # Checkout and payment
│   │   └── OrderSummaryPage.jsx   # Order confirmation
│   ├── utils/
│   ├── config.js                  # Environment configuration
│   ├── App.jsx                    # Main app component with routing
│   ├── main.jsx                   # App entry point
│   └── index.css                  # Global styles
├── .env                           # Environment variables (not committed)
├── .env.example                   # Template for env vars
├── package.json                   # Dependencies
├── vite.config.js                 # Vite configuration
├── tailwind.config.js             # Tailwind theme
└── postcss.config.js              # PostCSS configuration
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

The app integrates with the Blumelein Server API for order management and payment processing. All API calls are centralized in `src/adapters/serverApiAdapter.js` for easy maintenance.

### Endpoints

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/orders` | POST | Submit order | ✅ Implemented |
| `/orders/{order_id}` | GET | Get order details | ✅ Implemented |
| `/payments/create-payment-intent` | POST | Create payment | ✅ Implemented |

### API Adapter Usage

```javascript
import serverApiAdapter from './adapters/serverApiAdapter';

// Submit order
const order = await serverApiAdapter.submitOrder({
  items: [...],
  buyer_full_name: "John Doe",
  buyer_email: "john.doe@example.com",
  buyer_phone: "+1-555-0123",
  delivery_address: "123 Main St"
});

// Get order by ID
const order = await serverApiAdapter.getOrderById(orderId);

// Create payment intent
const paymentIntent = await serverApiAdapter.createPaymentIntent({
  order_id: orderId,
  amount: 5500,
  currency: "usd"
});
```

### Request/Response Models

**OrderCreate** (POST /orders)
```json
{
  "items": [
    {
      "main_colours": ["red", "pink"],
      "size": "M",
      "comments": "Please include roses"
    }
  ],
  "buyer_full_name": "Jane Smith",
  "buyer_email": "jane.smith@example.com",
  "buyer_phone": "+1-555-0123",
  "delivery_address": "123 Main St, New York, NY 10001"
}
```

**PaymentIntent** (POST /payments/create-payment-intent)
```json
{
  "order_id": "550e8400-e29b-41d4-a716-446655440000",
  "amount": 5500,
  "currency": "usd"
}
```

## Configuration

### Environment Variables

All configuration is managed through environment variables in `.env`:

- `VITE_CLIENT_BASE_PATH`: Base path for the application (e.g., `/Blumelein-App` for GitHub Pages, `/` or empty for root domain)
- `VITE_SERVER_API_BASE_URL`: Backend API base URL (e.g., `http://localhost:8000`)
- `VITE_STRIPE_PUBLISHABLE_KEY`: Stripe publishable key (starts with `pk_test_`)

These are loaded into `src/config.js` as constants:

```javascript
import config from './config';

console.log(config.serverApiBaseUrl);
console.log(config.stripePublishableKey);
```

### Customization

#### Change Prices
Update the `SIZES` constant in these files:
- `src/components/ItemConfigurator.jsx`
- `src/components/BasketItem.jsx`
- `src/pages/BasketPage.jsx`
- `src/pages/CheckoutPage.jsx`
- `src/pages/OrderSummaryPage.jsx`

#### Add/Remove Colors
Edit the `COLOURS` array in `src/components/ItemConfigurator.jsx`

#### Change Theme
Edit `tailwind.config.js` theme colors

## User Flow

### Complete Purchase Flow

1. **Home Page** (`/`)
   - Select bouquet size (Small, Medium, or Large)
   - Choose colors (multiple selection)
   - Add special comments/requests
   - Click "Add to Basket"

2. **Basket** (`/basket`)
   - Review all items in basket
   - Remove unwanted items (with confirmation)
   - Click "Proceed to Checkout"

3. **Checkout** (`/checkout`)
   - **Step 1**: Enter name and delivery address
   - **Step 2**: Complete payment with Stripe
   - Order created and payment processed

4. **Order Summary** (`/order-summary/:orderId`)
   - View complete order details
   - Print order summary
   - Create another bouquet

### Flow Variations

**Quick Purchase**:
```
Home → Configure Bouquet → Add to Basket → Checkout → 
Enter Details → Payment → Order Confirmation
```

**Multiple Items**:
```
Home → Configure Bouquet #1 → Add to Basket → 
Home → Configure Bouquet #2 → Add to Basket → 
View Basket → Review Items → Checkout → 
Enter Details → Payment → Order Confirmation
```

**Basket Management**:
```
Home → Add Items → View Basket → Remove Item → 
Continue Shopping → Add More Items → Checkout
```

## Pricing

| Size | Price | Description |
|------|-------|-------------|
| Small (S) | $35 | Perfect for a desk or small table |
| Medium (M) | $55 | Ideal for most occasions |
| Large (L) | $85 | Makes a grand statement |

**Delivery**: FREE for all orders

## Payment Testing

### Test Cards (Stripe Test Mode)

Use these test card numbers in development:

| Card Number | Result | Use For |
|-------------|--------|---------|
| 4242 4242 4242 4242 | ✅ Success | Happy path testing |
| 4000 0000 0000 0002 | ❌ Decline | Test error handling |
| 4000 0000 0000 9995 | ❌ Insufficient funds | Test specific errors |
| 4000 0025 0000 3155 | ⚠️ Requires authentication | Test 3D Secure |
| 4000 0000 0000 0069 | ❌ Expired card | Test expiration error |

- **Expiry**: Any future date (e.g., 12/25)
- **CVC**: Any 3 digits (e.g., 123)
- **ZIP**: Any 5 digits (e.g., 12345)

### Testing the Payment Flow

1. **Check Stripe Key**
   - Open browser console
   - Verify you see: `🔑 Initializing Stripe with key: pk_test_...`
   - If not, check your `.env` file

2. **Complete Test Purchase**
   - Add item to basket
   - Go to checkout
   - Enter delivery details:
     - Full Name: `Test User`
     - Email: `test@example.com`
     - Phone: Select country and enter valid phone number (e.g., US: `(555) 123-4567`)
     - Delivery Address: `123 Test St, Test City, TC 12345`
   - Wait for payment form to load
   - Console should show: `✅ Payment Element is ready`
   - Enter test card: `4242 4242 4242 4242`
   - Click "Complete Payment"
   - Console should show: `✅ Payment succeeded!`
   - Redirects to order summary page

### Expected Console Logs (Successful Flow)

```
⚙️ Config loaded: { serverApiBaseUrl: "http://localhost:8000", ... }
🔧 API Adapter initialized with baseUrl: http://localhost:8000
🔑 Initializing Stripe with key: pk_test_...

[User enters details and clicks continue]

🚀 Making API request: { url: "http://localhost:8000/orders", method: "POST" }
📥 API response received: { status: 201, statusText: "Created" }
🚀 Making API request: { url: "http://localhost:8000/payments/create-payment-intent", method: "POST" }
📥 API response received: { status: 201, statusText: "Created" }

[Payment form loads]

✅ Payment Element is ready

[User enters card and clicks Complete Payment]

💳 Starting payment confirmation...
✅ Payment succeeded! { id: "pi_...", status: "succeeded", ... }

[Redirects to order summary]

🚀 Making API request: { url: "http://localhost:8000/orders/...", method: "GET" }
📥 API response received: { status: 200, statusText: "OK" }
```

### Testing Different Scenarios

#### Test Success Path
```
Card: 4242 4242 4242 4242
Expected: Payment succeeds, redirects to order summary
```

#### Test Decline
```
Card: 4000 0000 0000 0002
Expected: Shows error "Your card was declined"
```

#### Test Insufficient Funds
```
Card: 4000 0000 0000 9995
Expected: Shows error "Your card has insufficient funds"
```

#### Test Authentication Required
```
Card: 4000 0025 0000 3155
Expected: Opens 3D Secure authentication modal
```

## Design System

### Color Palette

- **Primary**: Pink (#EC4899 - primary-500)
- **Primary Light**: #FCE7F3 (primary-100)
- **Primary Dark**: #BE185D (primary-700)
- **Success**: Green (#10B981)
- **Error**: Red (#EF4444)
- **Neutral**: Gray scale

### Typography

- **Headings**: Bold, large sizing (text-2xl to text-5xl)
- **Body**: Default system font stack
- **Labels**: Font-medium, text-sm
- **Buttons**: Font-semibold

### Spacing

- **Consistent Scale**: 4px base unit (Tailwind spacing)
- **Component Padding**: 16px - 32px
- **Section Margins**: 32px - 48px

### Shadows

- **Cards**: shadow-sm to shadow-md
- **Hover States**: shadow-md to shadow-lg
- **Modals/Dropdowns**: shadow-xl

### Animations

- **Transitions**: All transitions 200-300ms
- **Hover Effects**: Scale, color, shadow changes
- **Loading**: Spin animation for spinners
- **Success**: Fade-in animations

## Accessibility

### WCAG 2.1 AA Compliance

The app follows accessibility best practices:

#### Keyboard Navigation
- Tab order follows visual order
- All interactive elements keyboard accessible
- Visible focus indicators on all focusable elements

#### Screen Readers
- ARIA labels on all interactive elements
- Descriptive link text
- Status messages announced
- Form labels properly associated

#### Visual Accessibility
- Color contrast ratios meet AA standards
- Focus indicators visible
- No content relies solely on color
- Text resizable up to 200%

#### Touch-Friendly
- Large tap targets (minimum 44x44px)
- Touch gestures for mobile
- Smooth scrolling

## Security

### Frontend Security

- **No Sensitive Storage**: No passwords or payment details stored locally
- **Environment Variables**: API keys in `.env`, not committed to git
- **XSS Protection**: React's built-in XSS protection
- **HTTPS**: Should be enforced in production
- **Content Security Policy**: Recommended for production

### Payment Security

- **PCI Compliance**: Stripe handles all card data
- **No Card Storage**: Cards never touch frontend/backend
- **Secure Transmission**: All payment data via HTTPS
- **Tokenization**: Stripe tokens used instead of card numbers

### Best Practices

- Never commit `.env` file (in `.gitignore`)
- Use test keys in development
- Use live keys only in production
- Enable CORS properly on backend
- Regular dependency updates

## Troubleshooting

### Payment Issues

#### "Invalid API key provided"
**Cause**: Wrong or missing Stripe key

**Solution**:
1. Check `.env` has correct key from Stripe Dashboard
2. Make sure it's `pk_test_` (publishable key), not `sk_test_` (secret key)
3. Restart frontend: `npm run dev`

#### Payment Element doesn't appear
**Cause**: `clientSecret` not created or invalid

**Solution**:
1. Check backend logs for payment intent creation errors
2. Verify backend has Stripe secret key configured
3. Check console for API errors during "Continue to Payment"

#### Button stays disabled
**Cause**: Payment Element not loading

**Solution**:
1. Check console for errors
2. Verify Stripe key is valid
3. Try refreshing the page
4. Check network tab for blocked requests

### API Connection Issues

#### "Failed to fetch" errors
**Cause**: Backend not running or CORS issues

**Solution**:
- Check backend is running at `VITE_SERVER_API_BASE_URL`
- Verify CORS settings on backend allow `http://localhost:5173`
- Check Network tab in DevTools for error details

#### Order not found
**Cause**: Order ID mismatch or database issue

**Solution**:
- Verify order was created successfully
- Check backend database for order
- Ensure order ID in URL is correct

### Build Errors

```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Debugging Tips

#### Check Stripe Dashboard
1. Go to: https://dashboard.stripe.com/test/payments
2. You should see test payments appear here
3. Check payment status and error messages

#### Check Backend Logs
Look for Stripe-related errors:
```
stripe.error.CardError
stripe.error.InvalidRequestError
stripe.error.AuthenticationError
```

#### Check Browser Console
Look for:
```
❌ Payment error: [error message]
❌ Payment Element load error: [error message]
```

#### Check Network Tab
1. Open DevTools → Network tab
2. Look for requests to:
   - `/orders` (should be 201)
   - `/payments/create-payment-intent` (should be 201)
   - `api.stripe.com` (should be 200)

## Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### Performance

**Build Size**:
- JavaScript: ~206 KB (64 KB gzipped)
- CSS: ~18 KB (4 KB gzipped)
- Total: ~224 KB (68 KB gzipped)

**Load Time**:
- Development: Instant (Vite HMR)
- Production: < 2 seconds on 3G

**Optimization Features**:
- Code splitting by route
- CSS purging (unused styles removed)
- Asset minification
- Tree shaking

### Environment Variables in Production

Make sure to set these in your hosting platform:
- `VITE_CLIENT_BASE_PATH`: Base path for your deployment (e.g., `/repository-name` for GitHub Pages, `/` or empty for root domain)
- `VITE_SERVER_API_BASE_URL`: Your production API URL
- `VITE_STRIPE_PUBLISHABLE_KEY`: Your live Stripe key (starts with `pk_live_`)

#### Setting up GitHub Secrets

For GitHub Pages deployment, add these secrets to your repository:

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add:
   - Name: `VITE_CLIENT_BASE_PATH`, Value: `/Blumelein-App` (or your repository name)
   - Name: `VITE_SERVER_API_BASE_URL`, Value: Your production API URL
   - Name: `VITE_STRIPE_PUBLISHABLE_KEY`, Value: Your Stripe publishable key

These secrets are automatically used during the GitHub Actions build process as defined in `.github/workflows/build-deploy.yml`.

### Deployment Checklist

- [ ] Set production environment variables
- [ ] Update API URL to production backend
- [ ] Use live Stripe keys (not test keys)
- [ ] Enable HTTPS
- [ ] Configure CORS on backend
- [ ] Set up Stripe webhooks
- [ ] Test complete purchase flow
- [ ] Monitor error tracking

## Future Enhancements

### Phase 2 Features

- **User Accounts**: Login, order history, saved addresses
- **Favorites**: Save favorite bouquet configurations
- **Gift Messages**: Add personalized messages to bouquets
- **Delivery Scheduling**: Choose delivery date and time
- **Multiple Addresses**: Save and select from multiple delivery addresses
- **Promo Codes**: Discount code support
- **Order Tracking**: Real-time order status updates
- **Reviews**: Customer reviews and ratings
- **Image Gallery**: Photos of actual bouquets
- **Social Sharing**: Share bouquet designs on social media

### Technical Improvements

- **React Query**: Better data fetching and caching
- **TypeScript**: Type safety throughout the application
- **Storybook**: Component documentation and development
- **Unit Tests**: Jest + React Testing Library
- **E2E Tests**: Cypress or Playwright for end-to-end testing
- **Performance Monitoring**: Web Vitals tracking
- **Error Tracking**: Sentry integration
- **Analytics**: Google Analytics or similar

## Browser Support

### Supported Browsers

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Required Features

- ES6+ JavaScript
- Fetch API
- Storage Adapter Pattern
- CSS Grid & Flexbox
- Custom Properties (CSS Variables)

## Validation Rules

### Item Configuration

- **Size**: Required, must be S, M, or L
- **Colors**: At least 1 color required
- **Comments**: Optional, max 500 characters

### Checkout Form

- **Full Name**: 
  - Required
  - 1-100 characters
  - Trimmed whitespace
- **Delivery Address**: 
  - Required
  - 1-300 characters
  - Trimmed whitespace

### Basket

- **Minimum Items**: At least 1 item required for checkout
- **Maximum Items**: No limit (UI handles scrolling)

## Maintenance

### Regular Updates

- Dependencies: Monthly security updates
- Browser testing: After major browser updates
- API compatibility: When backend changes
- Accessibility audit: Quarterly

### Monitoring

- Error rates
- Page load times
- Conversion rates (add to basket, checkout completion)
- Payment success rates

## Support

For issues or questions, refer to:
- [React Documentation](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Stripe React Integration](https://stripe.com/docs/stripe-js/react)
- [Vite Guide](https://vitejs.dev/guide/)