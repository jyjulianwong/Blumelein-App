import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

/**
 * Remove trailing slash from a path string
 * @param {string} path - The path to process
 * @returns {string} - Path without trailing slash
 */
const removeTrailingSlash = (path) => {
  if (!path) return '';
  return path.endsWith('/') ? path.slice(0, -1) : path;
};

// Get base path from environment and remove trailing slash
const basePath = removeTrailingSlash(process.env.VITE_CLIENT_BASE_PATH || '');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Ensure base has trailing slash for proper asset loading
  base: basePath ? `${basePath}/` : '/',
});
