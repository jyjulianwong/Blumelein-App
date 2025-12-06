/**
 * Centralized configuration file for loading environment variables
 */

const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  stripePublishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
};

// Debug logging
console.log('⚙️ Config loaded:', {
  apiBaseUrl: config.apiBaseUrl,
  stripeKeyPresent: !!config.stripePublishableKey,
  env: {
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    mode: import.meta.env.MODE,
  }
});

// Validation
if (!config.apiBaseUrl) {
  console.error('VITE_API_BASE_URL is not defined in environment variables');
}

if (!config.stripePublishableKey) {
  console.warn('VITE_STRIPE_PUBLISHABLE_KEY is not defined in environment variables');
}

export default config;


