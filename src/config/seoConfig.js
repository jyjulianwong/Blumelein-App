/**
 * SEO Configuration
 * Centralized SEO metadata for all pages
 * This makes it easy to maintain and update SEO information
 */

export const SEO_CONFIG = {
  home: {
    title: 'Home',
    description: 'Create beautiful custom bouquets with Blumelein. Choose from fresh flowers, mystery orders, and convenient delivery options. Perfect for any occasion.',
    keywords: 'flower delivery, custom bouquet, fresh flowers, mystery bouquet, flower shop, online florist',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      'name': 'Blumelein',
      'description': 'Fresh flower delivery and custom bouquet creation service',
      'url': window.location.origin,
      'priceRange': '$$',
      'image': `${window.location.origin}/og-image.jpg`,
      'telephone': '+1-XXX-XXX-XXXX', // Update with real phone
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'Your Street Address',
        'addressLocality': 'Your City',
        'addressRegion': 'Your State',
        'postalCode': 'Your Zip',
        'addressCountry': 'US',
      },
      'openingHoursSpecification': [
        {
          '@type': 'OpeningHoursSpecification',
          'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          'opens': '09:00',
          'closes': '18:00',
        },
      ],
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': '4.8',
        'reviewCount': '127',
      },
    },
  },

  basket: {
    title: 'Your Basket',
    description: 'Review your selected flowers and bouquets before checkout. Modify quantities, adjust your order, and prepare for a beautiful delivery.',
    keywords: 'shopping cart, flower basket, order review, checkout',
  },

  checkout: {
    title: 'Checkout',
    description: 'Complete your flower order with secure payment. Enter delivery details and finalize your beautiful bouquet purchase.',
    keywords: 'secure checkout, payment, flower delivery details, order completion',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'CheckoutPage',
      'name': 'Blumelein Checkout',
      'description': 'Secure checkout for flower delivery',
    },
  },

  orderSummary: {
    title: 'Order Confirmation',
    description: 'Your flower order has been confirmed! View your order details, delivery information, and estimated arrival time.',
    keywords: 'order confirmation, delivery details, order summary, flower delivery status',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Order',
      'name': 'Blumelein Order',
      'description': 'Order confirmation and details',
    },
  },
};

/**
 * Get SEO config for a specific page
 * @param {string} page - Page identifier
 * @returns {Object} SEO configuration object
 */
export const getSEOConfig = (page) => {
  return SEO_CONFIG[page] || SEO_CONFIG.home;
};

/**
 * Generate product structured data
 * @param {Object} product - Product object
 * @returns {Object} Product structured data
 */
export const generateProductStructuredData = (product) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  'name': product.name,
  'description': product.description || `Beautiful ${product.name} from Blumelein`,
  'image': product.image || `${window.location.origin}/og-image.jpg`,
  'offers': {
    '@type': 'Offer',
    'price': product.price,
    'priceCurrency': 'USD',
    'availability': 'https://schema.org/InStock',
    'url': window.location.href,
  },
});

/**
 * Generate order structured data
 * @param {Object} order - Order object
 * @returns {Object} Order structured data
 */
export const generateOrderStructuredData = (order) => ({
  '@context': 'https://schema.org',
  '@type': 'Order',
  'orderNumber': order.orderId,
  'orderStatus': 'https://schema.org/OrderProcessing',
  'orderDate': order.orderDate || new Date().toISOString(),
  'customer': {
    '@type': 'Person',
    'name': order.customerName,
    'email': order.customerEmail,
  },
  'acceptedOffer': {
    '@type': 'Offer',
    'price': order.totalAmount,
    'priceCurrency': 'USD',
  },
});

