import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import serverApiAdapter from '../adapters/serverApiAdapter';
import { CONTACT_INFO, SUPPORT_MESSAGES } from '../constants';
import SEO from '../components/SEO';
import { getSEOConfig, generateOrderStructuredData } from '../config/seoConfig';

const SIZES = {
  S: { label: 'Small', price: 35 },
  M: { label: 'Medium', price: 55 },
  L: { label: 'Large', price: 85 },
};

const OrderSummaryPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError('No order ID provided.');
        setIsLoading(false);
        return;
      }

      try {
        const orderData = await serverApiAdapter.getOrderById(orderId);
        setOrder(orderData);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const calculateTotal = () => {
    if (!order) return 0;
    return order.items.reduce((total, item) => {
      return total + (SIZES[item.size]?.price || 0);
    }, 0);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const seoConfig = getSEOConfig('orderSummary');
  const orderStructuredData = order ? generateOrderStructuredData({
    orderId: order.orderId,
    orderDate: order.createdAt,
    customerName: order.buyerFullName,
    customerEmail: order.buyerEmail,
    totalAmount: calculateTotal(),
  }) : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
            <p className="text-gray-600 mb-8">{error || 'We could not find your order.'}</p>
            <Link
              to="/"
              className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const total = calculateTotal();

  return (
    <>
      <SEO 
        {...seoConfig} 
        title={`Order #${order.orderId.substring(0, 8)} Confirmation`}
        structuredData={orderStructuredData}
      />
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">
            Thank you for your order. We'll start preparing your beautiful bouquets right away.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-6">
          {/* Order Info */}
          <div className="border-b pb-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Order ID</h3>
                <p className="text-gray-900 font-mono text-sm">{order.order_id}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Order Date</h3>
                <p className="text-gray-900">{formatDate(order.created_at)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Payment Status</h3>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  order.payment_status === 'Completed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.payment_status}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Order Status</h3>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  order.order_status === 'Completed'
                    ? 'bg-green-100 text-green-800'
                    : order.order_status === 'In Progress'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {order.order_status}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="border-b pb-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Delivery Details</h2>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p className="font-medium text-gray-900">{order.buyer_full_name}</p>
              {order.buyer_email && (
                <p className="text-gray-600">
                  <span className="font-medium">Email:</span> {order.buyer_email}
                </p>
              )}
              {order.buyer_phone && (
                <p className="text-gray-600">
                  <span className="font-medium">Phone:</span> {order.buyer_phone}
                </p>
              )}
              <p className="text-gray-600 pt-2">{order.delivery_address}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={item.item_id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl" role="img" aria-label="bouquet">💐</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Bouquet #{index + 1} - {SIZES[item.size]?.label}
                        </h3>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      ${SIZES[item.size]?.price}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Colours: </span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {item.main_colours.map((colour) => (
                          <span
                            key={colour}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 capitalize"
                          >
                            {colour}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {item.comments && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Special Requests: </span>
                        <p className="text-sm text-gray-700 mt-1">{item.comments}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Total */}
          <div className="border-t pt-6">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span className="text-green-600 font-medium">FREE</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900">
                <span>Total Paid</span>
                <span className="text-primary-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-center"
          >
            Create Another Bouquet
          </Link>
          <button
            type="button"
            onClick={() => window.print()}
            className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            aria-label="Print order summary"
          >
            Print Order Summary
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-2">What happens next?</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>You'll receive an email confirmation shortly.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Our florists will carefully prepare your bouquets.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Your order will be delivered to the address provided.</span>
            </li>
          </ul>
        </div>

        {/* Contact Information */}
        <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Need Help?</h3>
          <p className="text-sm text-gray-600 mb-4">{SUPPORT_MESSAGES.orderInquiries}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="font-medium text-gray-900">Email</p>
                <a href={`mailto:${CONTACT_INFO.email}`} className="text-primary-600 hover:text-primary-700">
                  {CONTACT_INFO.email}
                </a>
              </div>
            </div>

            <div className="flex items-start">
              <svg className="w-5 h-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <div>
                <p className="font-medium text-gray-900">Phone</p>
                <a href={`tel:${CONTACT_INFO.phone}`} className="text-primary-600 hover:text-primary-700">
                  {CONTACT_INFO.phone}
                </a>
              </div>
            </div>

            <div className="flex items-start">
              <svg className="w-5 h-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              <div>
                <p className="font-medium text-gray-900">Instagram</p>
                <a href={`https://instagram.com/${CONTACT_INFO.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                  {CONTACT_INFO.instagram}
                </a>
              </div>
            </div>

            <div className="flex items-start">
              <svg className="w-5 h-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <div>
                <p className="font-medium text-gray-900">Facebook</p>
                <a href={`https://facebook.com/${CONTACT_INFO.facebook}`} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                  {CONTACT_INFO.facebook}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default OrderSummaryPage;


