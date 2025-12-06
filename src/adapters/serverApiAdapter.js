/**
 * Server API Adapter class for handling all backend API calls
 */
import config from '../config';

class ServerApiAdapter {
  constructor() {
    this.baseUrl = config.apiBaseUrl;
    console.log('🔧 Server API Adapter initialized with baseUrl:', this.baseUrl);
  }

  /**
   * Generic fetch wrapper with error handling
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    // Debug logging
    console.log('🚀 Making API request:', {
      url,
      method: options.method || 'GET',
      baseUrl: this.baseUrl,
    });
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const fetchOptions = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, fetchOptions);
      
      console.log('📥 API response received:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ API request failed for ${endpoint}:', error);
      throw error;
    }
  }

  /**
   * Submit a new order
   * POST /orders
   */
  async submitOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  /**
   * Get order by ID
   * GET /orders/{order_id}
   */
  async getOrderById(orderId) {
    return this.request(`/orders/${orderId}`, {
      method: 'GET',
    });
  }

  /**
   * Create a Stripe payment intent
   * POST /payments/create-payment-intent
   */
  async createPaymentIntent(paymentData) {
    return this.request('/payments/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  /**
   * Health check
   * GET /health
   */
  async healthCheck() {
    return this.request('/health', {
      method: 'GET',
    });
  }
}

// Export singleton instance
export default new ServerApiAdapter();

