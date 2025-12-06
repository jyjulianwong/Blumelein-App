import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import serverApiAdapter from '../adapters/serverApiAdapter';

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
              <span>You'll receive an email confirmation shortly</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Our florists will carefully prepare your bouquets</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Your order will be delivered to the address provided</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryPage;


