# Quick Reference Card

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Important Files

| File | Purpose |
|------|---------|
| `.env` | Environment variables (API URL, Stripe key) |
| `src/utils/config.js` | Configuration loader |
| `src/api/apiAdapter.js` | All API calls |
| `src/context/BasketContext.jsx` | Shopping basket state |
| `src/App.jsx` | Main app with routing |

## Routes

| Path | Component | Purpose |
|------|-----------|---------|
| `/` | HomePage | Bouquet builder |
| `/basket` | BasketPage | Shopping basket |
| `/checkout` | CheckoutPage | Payment flow |
| `/order-summary/:orderId` | OrderSummaryPage | Order confirmation |

## API Endpoints Used

```javascript
// Submit order
POST /orders
Body: { items, buyer_full_name, delivery_address }

// Get order
GET /orders/{order_id}

// Create payment
POST /payments/create-payment-intent
Body: { order_id, amount, currency }
```

## Pricing

| Size | Price |
|------|-------|
| Small (S) | $35 |
| Medium (M) | $55 |
| Large (L) | $85 |

## Environment Variables

```bash
VITE_API_BASE_URL=http://localhost:8000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Common Tasks

### Change Prices
Edit SIZES constant in:
- `src/components/ItemConfigurator.jsx`
- `src/components/BasketItem.jsx`
- `src/pages/BasketPage.jsx`
- `src/pages/CheckoutPage.jsx`
- `src/pages/OrderSummaryPage.jsx`

### Add New Color
Edit COLOURS constant in:
- `src/components/ItemConfigurator.jsx`

```javascript
{ value: 'green', label: 'Green', hex: '#10B981' }
```

### Change Theme Color
Edit `tailwind.config.js`:

```javascript
colors: {
  primary: {
    // Add your color scale
  },
}
```

### Add API Endpoint
In `src/api/apiAdapter.js`:

```javascript
async myNewEndpoint(data) {
  return this.request('/my-endpoint', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
```

## Stripe Test Cards

| Card Number | Result |
|-------------|--------|
| 4242 4242 4242 4242 | Success |
| 4000 0000 0000 0002 | Decline |
| 4000 0000 0000 9995 | Insufficient funds |

Use any future expiry and any CVC.

## Troubleshooting

### "Failed to fetch"
- Check backend is running
- Verify `VITE_API_BASE_URL` in `.env`
- Check CORS settings on backend

### Payment Not Working
- Verify `VITE_STRIPE_PUBLISHABLE_KEY` in `.env`
- Use test mode key (starts with `pk_test_`)
- Check Stripe Dashboard for errors

### Build Errors
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Clear Browser Data
```bash
# Open DevTools
# Application → Storage → Clear site data
```

## Project Structure

```
src/
├── api/
│   └── apiAdapter.js       # API client
├── components/
│   ├── Header.jsx          # Navigation
│   ├── ItemConfigurator.jsx # Bouquet builder
│   ├── BasketItem.jsx      # Basket item display
│   └── PaymentForm.jsx     # Stripe payment
├── context/
│   └── BasketContext.jsx   # Basket state
├── pages/
│   ├── HomePage.jsx        # Landing
│   ├── BasketPage.jsx      # Basket view
│   ├── CheckoutPage.jsx    # Checkout flow
│   └── OrderSummaryPage.jsx # Confirmation
├── utils/
│   └── config.js           # Config loader
├── App.jsx                 # Router setup
├── main.jsx                # Entry point
└── index.css               # Global styles
```

## Key Dependencies

| Package | Purpose |
|---------|---------|
| react | UI framework |
| react-router-dom | Routing |
| @stripe/react-stripe-js | Stripe integration |
| @stripe/stripe-js | Stripe SDK |
| tailwindcss | Styling |

## Component Props

### BasketItem
```javascript
<BasketItem 
  item={{
    id, 
    size, 
    main_colours, 
    comments
  }} 
  onRemove={fn} 
/>
```

### PaymentForm
```javascript
<PaymentForm 
  clientSecret="pi_xxx_secret_xxx" 
  onSuccess={fn} 
/>
```

## Context Usage

```javascript
import { useBasket } from './context/BasketContext';

const { 
  items,        // Array of basket items
  addItem,      // (item) => void
  removeItem,   // (id) => void
  updateItem,   // (id, data) => void
  clearBasket,  // () => void
  getItemCount  // () => number
} = useBasket();
```

## API Adapter Usage

```javascript
import apiAdapter from './api/apiAdapter';

// Submit order
const order = await apiAdapter.submitOrder(orderData);

// Get order
const order = await apiAdapter.getOrderById(orderId);

// Create payment
const payment = await apiAdapter.createPaymentIntent(paymentData);
```

## Styling Guidelines

### Tailwind Classes
```javascript
// Buttons
className="bg-primary-600 text-white py-3 px-6 rounded-lg 
           font-semibold hover:bg-primary-700 transition-colors"

// Cards
className="bg-white rounded-lg shadow-md p-6"

// Inputs
className="w-full px-4 py-3 border border-gray-300 rounded-lg 
           focus:ring-2 focus:ring-primary-500 focus:border-transparent"
```

### Color Usage
- Primary: main brand actions
- Gray: neutral elements
- Green: success states
- Red: errors/warnings
- Blue: informational

## Git Workflow

```bash
# Check status
git status

# Add changes
git add .

# Commit
git commit -m "Description of changes"

# Push
git push origin main
```

## Deployment

### Build
```bash
npm run build
# Output: dist/
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Environment Variables (Production)
Set these in your hosting platform:
- `VITE_API_BASE_URL`
- `VITE_STRIPE_PUBLISHABLE_KEY`

## Support Resources

- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Stripe Docs](https://stripe.com/docs)
- [Vite Guide](https://vitejs.dev)
- [React Router](https://reactrouter.com)

## Contact

For questions about this project, refer to:
- `README.md` - General overview
- `SETUP.md` - Setup instructions
- `API_INTEGRATION.md` - API details
- `FEATURES.md` - Feature documentation


