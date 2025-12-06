/**
 * Centralized configuration file for loading environment variables
 */

/**
 * Remove trailing slash from a path string
 * @param {string} path - The path to process
 * @returns {string} - Path without trailing slash
 */
const removeTrailingSlash = (path) => {
  if (!path) return '';
  return path.endsWith('/') ? path.slice(0, -1) : path;
};

const config = {
  clientBasePath: removeTrailingSlash(import.meta.env.VITE_CLIENT_BASE_PATH || ''),
  serverApiBaseUrl: import.meta.env.VITE_SERVER_API_BASE_URL || 'http://localhost:8000',
  stripePublishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
};

// Debug logging
console.log('⚙️ Config loaded:', {
  clientBasePath: config.clientBasePath,
  serverApiBaseUrl: config.serverApiBaseUrl,
  stripeKeyPresent: !!config.stripePublishableKey,
  env: {
    VITE_CLIENT_BASE_PATH: import.meta.env.VITE_CLIENT_BASE_PATH,
    VITE_SERVER_API_BASE_URL: import.meta.env.VITE_SERVER_API_BASE_URL,
    mode: import.meta.env.MODE,
  },
});

// Validation
if (!config.serverApiBaseUrl) {
  console.error('VITE_SERVER_API_BASE_URL is not defined in environment variables');
}

if (!config.stripePublishableKey) {
  console.warn('VITE_STRIPE_PUBLISHABLE_KEY is not defined in environment variables');
}

export default config;

