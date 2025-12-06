# Base Path Configuration

This document explains how the `VITE_CLIENT_BASE_PATH` environment variable is configured and used throughout the Blumelein App.

## Overview

The base path is used to deploy the application to different environments:
- **GitHub Pages with repository path**: `/Blumelein-App`
- **Root domain deployment**: `/` or empty string
- **Custom subdirectory**: `/your-custom-path`

## Environment Variable

### Variable Name
```
VITE_CLIENT_BASE_PATH
```

### Format Rules
- **MUST NOT** have a trailing slash (e.g., `/Blumelein-App`, not `/Blumelein-App/`)
- Can be an empty string or `/` for root domain deployments
- Must start with `/` if not empty

### Examples
```bash
# For GitHub Pages
VITE_CLIENT_BASE_PATH=/Blumelein-App

# For root domain
VITE_CLIENT_BASE_PATH=/
# or
VITE_CLIENT_BASE_PATH=

# For custom subdirectory
VITE_CLIENT_BASE_PATH=/my-app
```

## Implementation Details

### 1. Vite Configuration (`vite.config.js`)

The base path is used with a **trailing slash** for proper asset loading:

```javascript
export default defineConfig({
  plugins: [react()],
  // Ensure base has trailing slash for proper asset loading
  base: process.env.VITE_CLIENT_BASE_PATH ? `${process.env.VITE_CLIENT_BASE_PATH}/` : '/',
})
```

**Why trailing slash?**
- Vite requires the `base` config to have a trailing slash
- This ensures asset paths like `/Blumelein-App/assets/index.js` are correctly generated
- Without it, assets would fail to load: `/Blumelein-Appassets/index.js` ❌

### 2. React Router (`src/App.jsx`)

The base path is used **without a trailing slash** for routing:

```javascript
const App = () => {
  // BrowserRouter basename should NOT have trailing slash
  const basename = import.meta.env.VITE_CLIENT_BASE_PATH || '/';
  
  return (
    <Router basename={basename}>
      {/* Routes */}
    </Router>
  );
};
```

**Why no trailing slash?**
- React Router expects `basename` without a trailing slash
- With trailing slash, routes like `/Blumelein-App//basket` would have double slashes ❌
- Without it, routes are correctly formed: `/Blumelein-App/basket` ✅

## Local Development Setup

### 1. Create `.env` file

```bash
# Copy from template
cp .env.example .env
```

### 2. Edit `.env`

```bash
# For GitHub Pages deployment
VITE_CLIENT_BASE_PATH=/Blumelein-App

# For local root path testing
# VITE_CLIENT_BASE_PATH=/
```

### 3. Start development server

```bash
npm run dev
```

The app will run at `http://localhost:5173/Blumelein-App/` (or root if configured)

## Production Deployment

### GitHub Actions (Automated)

The environment variable is automatically passed during the build process via GitHub Secrets.

#### Setting up GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the secret:
   - **Name**: `VITE_CLIENT_BASE_PATH`
   - **Value**: `/Blumelein-App` (or your repository name)

#### Workflow Configuration (`.github/workflows/build-deploy.yml`)

```yaml
- name: Build
  run: npm run build
  env:
    VITE_CLIENT_BASE_PATH: ${{ secrets.VITE_CLIENT_BASE_PATH }}
    VITE_SERVER_API_BASE_URL: ${{ secrets.VITE_SERVER_API_BASE_URL }}
    VITE_STRIPE_PUBLISHABLE_KEY: ${{ secrets.VITE_STRIPE_PUBLISHABLE_KEY }}
```

### Manual Build

```bash
# Set the environment variable and build
VITE_CLIENT_BASE_PATH=/Blumelein-App npm run build
```

### Verify Build Output

Check that asset paths in `dist/index.html` have the correct base path:

```bash
grep -E '(href|src)=' dist/index.html
```

Expected output:
```html
<script type="module" crossorigin src="/Blumelein-App/assets/index-XXX.js"></script>
<link rel="stylesheet" crossorigin href="/Blumelein-App/assets/index-XXX.css">
```

## Troubleshooting

### Assets Not Loading (404 errors)

**Symptom**: JavaScript and CSS files return 404 errors

**Cause**: Base path mismatch or missing trailing slash in Vite config

**Solution**:
1. Check that `VITE_CLIENT_BASE_PATH` is set correctly
2. Verify Vite adds trailing slash: `${process.env.VITE_CLIENT_BASE_PATH}/`
3. Rebuild with the correct environment variable

### Routes Not Working

**Symptom**: Direct navigation to routes returns 404

**Cause**: 
- React Router basename misconfigured
- Or server not configured for SPA routing

**Solution**:
1. Verify `basename` in `App.jsx` does NOT have trailing slash
2. For GitHub Pages, ensure `.nojekyll` file exists (handled by `actions/configure-pages`)
3. Check that the basename matches your deployment path

### Double Slashes in URLs

**Symptom**: URLs like `//basket` or `/Blumelein-App//checkout`

**Cause**: Trailing slash on React Router basename

**Solution**:
```javascript
// ❌ Wrong
const basename = import.meta.env.VITE_CLIENT_BASE_PATH + '/';

// ✅ Correct
const basename = import.meta.env.VITE_CLIENT_BASE_PATH || '/';
```

## Testing Different Configurations

### Test Root Path

```bash
VITE_CLIENT_BASE_PATH=/ npm run dev
```

Visit: `http://localhost:5173/`

### Test Subdirectory

```bash
VITE_CLIENT_BASE_PATH=/test-path npm run dev
```

Visit: `http://localhost:5173/test-path/`

### Test GitHub Pages Path

```bash
VITE_CLIENT_BASE_PATH=/Blumelein-App npm run dev
```

Visit: `http://localhost:5173/Blumelein-App/`

## Files Modified

- `.env` - Local environment configuration (not committed)
- `.env.example` - Template with all environment variables
- `vite.config.js` - Uses `VITE_CLIENT_BASE_PATH` with trailing slash
- `src/App.jsx` - Uses `VITE_CLIENT_BASE_PATH` without trailing slash
- `.github/workflows/build-deploy.yml` - Passes `VITE_CLIENT_BASE_PATH` from secrets
- `README.md` - Updated documentation
- `QUICK_REFERENCE.md` - Updated environment variables section

## Summary

| Component | Trailing Slash | Example Value | Reason |
|-----------|----------------|---------------|---------|
| Environment Variable | ❌ No | `/Blumelein-App` | Standard format |
| Vite `base` config | ✅ Yes | `/Blumelein-App/` | Required by Vite for asset paths |
| React Router `basename` | ❌ No | `/Blumelein-App` | Required by React Router for routing |

This ensures:
- ✅ Assets load correctly: `/Blumelein-App/assets/index.js`
- ✅ Routes work correctly: `/Blumelein-App/basket`
- ✅ No double slashes or broken paths
- ✅ Easy to change for different deployment targets

