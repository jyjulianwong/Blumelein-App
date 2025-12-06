# Font Usage Guide

This project uses two custom Google Fonts that are configured through TailwindCSS for easy maintenance.

## Fonts

### 1. IBM Plex Serif (Display/Body Font)
- **Usage**: Default body font, paragraphs, general content
- **TailwindCSS class**: `font-display`
- **Font family**: "IBM Plex Serif", serif
- **Available weights**: 100 (thin), 200 (extralight), 300 (light), 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- **Available styles**: normal, italic

### 2. The Girl Next Door (Handwriting Font)
- **Usage**: Headers, branding, decorative elements
- **TailwindCSS class**: `font-handwriting`
- **Font family**: "The Girl Next Door", cursive
- **Available weights**: 400 (regular)
- **Available styles**: normal

## How to Use

### Basic Usage

Use Tailwind's font utility classes throughout your React components:

```jsx
// Body text (default - no class needed)
<p>This text uses IBM Plex Serif by default</p>

// Explicitly use display font
<p className="font-display">This uses IBM Plex Serif</p>

// Use handwriting font for headers/branding
<h1 className="font-handwriting">Welcome to Blumelein</h1>

// Combine with font weights
<p className="font-display font-light">Light text</p>
<p className="font-display font-normal">Regular text</p>
<p className="font-display font-medium">Medium text</p>
<p className="font-display font-semibold">Semibold text</p>
<p className="font-display font-bold">Bold text</p>

// Use italic
<p className="font-display italic">Italic text</p>
```

### Examples

```jsx
// Branding/Logo
<div className="font-handwriting text-4xl text-primary-600">
  Blumelein
</div>

// Section heading
<h2 className="font-handwriting text-3xl mb-4">
  Create Your Bouquet
</h2>

// Body content
<p className="font-display text-base">
  Choose from fresh flowers, mystery orders, and convenient delivery options.
</p>

// Button with handwriting style
<button className="font-handwriting text-xl px-6 py-3">
  Order Now
</button>
```

## Changing Fonts in the Future

To change fonts globally, update in **one central location**:

### Option 1: Change Font Families

Edit `/tailwind.config.js`:

```js
fontFamily: {
  'display': ['"Your New Display Font"', 'serif'],
  'handwriting': ['"Your New Handwriting Font"', 'cursive'],
},
```

### Option 2: Update Google Fonts Import

Edit `/index.html` to import your new fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=Your+New+Font&display=swap" rel="stylesheet" />
```

### Option 3: Update Default Body Font

Edit `/src/index.css`:

```css
body {
  font-family: 'Your New Font', serif;
}
```

## Configuration Files

- **Font Import**: `/index.html` (lines 34-39)
- **TailwindCSS Config**: `/tailwind.config.js` (theme.extend.fontFamily)
- **Default Body Font**: `/src/index.css` (body selector)

## Available Tailwind Font Weight Classes

- `font-thin` - 100
- `font-extralight` - 200
- `font-light` - 300
- `font-normal` - 400 (default)
- `font-medium` - 500
- `font-semibold` - 600
- `font-bold` - 700
- `font-extrabold` - 800
- `font-black` - 900

Note: The Girl Next Door only supports `font-normal` (400 weight).

## Best Practices

1. **Use `font-display` for readability**: Body text, descriptions, forms
2. **Use `font-handwriting` sparingly**: Headers, brand elements, callouts
3. **Combine with proper weights**: Use font-light to font-bold for hierarchy
4. **Maintain consistency**: Use the same font patterns across similar components
5. **Accessibility**: Ensure sufficient contrast and readable font sizes

## Performance

The fonts are loaded via Google Fonts with:
- Preconnect links for faster loading
- `display=swap` parameter for better perceived performance
- Only necessary font weights loaded to minimize bundle size

