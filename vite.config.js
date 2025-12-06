import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Ensure base has trailing slash for proper asset loading
  base: process.env.VITE_CLIENT_BASE_PATH ? `${process.env.VITE_CLIENT_BASE_PATH}/` : '/',
})