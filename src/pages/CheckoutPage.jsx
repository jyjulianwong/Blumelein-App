import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useBasket } from '../context/BasketContext';
import PaymentForm from '../components/PaymentForm';
import serverApiAdapter from '../adapters/serverApiAdapter';
import config from '../config';
import { POLICIES } from '../constants';
import SEO from '../components/SEO';
import { getSEOConfig } from '../config/seoConfig';

// Initialize Stripe
console.log('🔑 Initializing Stripe with key:', config.stripePublishableKey?.substring(0, 20) + '...');
const stripePromise = loadStripe(config.stripePublishableKey);

const SIZES = {
  S: { price: 35 },
  M: { price: 55 },
  L: { price: 85 },
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, clearBasket } = useBasket();
  const [step, setStep] = useState(1); // 1: Details, 2: Payment
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const seoConfig = getSEOConfig('checkout');

  // Form state
  const [buyerFullName, setBuyerFullName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  
  // Order and payment state
  const [orderId, setOrderId] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      return total + (SIZES[item.size]?.price || 0);
    }, 0);
  };

  const handleSubmitDetails = async (e) => {
    e.preventDefault();
    
    if (!buyerFullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    
    if (!buyerEmail.trim()) {
      setError('Please enter your email address.');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(buyerEmail.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    
    if (!buyerPhone) {
      setError('Please enter your phone number.');
      return;
    }
    
    // Validate phone number using libphonenumber-js
    if (!isValidPhoneNumber(buyerPhone)) {
      setError('Please enter a valid phone number for the selected country.');
      return;
    }
    
    if (!deliveryAddress.trim()) {
      setError('Please enter a delivery address.');
      return;
    }

    if (items.length === 0) {
      setError('Your basket is empty.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Create order
      const orderData = {
        items: items.map((item) => ({
          main_colours: item.main_colours,
          size: item.size,
          comments: item.comments,
        })),
        buyer_full_name: buyerFullName.trim(),
        buyer_email: buyerEmail.trim(),
        buyer_phone: buyerPhone, // Already in E.164 format
        delivery_address: deliveryAddress.trim(),
      };

      const orderResponse = await serverApiAdapter.submitOrder(orderData);
      setOrderId(orderResponse.order_id);

      // Step 2: Create payment intent
      const totalInCents = Math.round(calculateTotal() * 100);
      const paymentResponse = await serverApiAdapter.createPaymentIntent({
        order_id: orderResponse.order_id,
        amount: totalInCents,
        currency: 'usd',
      });

      setClientSecret(paymentResponse.client_secret);
      
      // Move to payment step
      setStep(2);
    } catch (err) {
      console.error('Error submitting order:', err);
      setError(err.message || 'Failed to process order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    clearBasket();
    navigate(`/order-summary/${orderId}`);
  };

  const handleBackToDetails = () => {
    setStep(1);
    setClientSecret(null);
    setOrderId(null);
  };

  if (items.length === 0 && step === 1) {
    navigate('/basket');
    return null;
  }

  const total = calculateTotal();

  return (
    <>
      <SEO {...seoConfig} />
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center ${step >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200'
              }`}>
                1
              </div>
              <span className="ml-2 font-medium hidden sm:inline">Details</span>
            </div>
            <div className="w-16 h-1 bg-gray-300" />
            <div className={`flex items-center ${step >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200'
              }`}>
                2
              </div>
              <span className="ml-2 font-medium hidden sm:inline">Payment</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Delivery Details</h2>
                <form onSubmit={handleSubmitDetails}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="buyerFullName" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="buyerFullName"
                        value={buyerFullName}
                        onChange={(e) => setBuyerFullName(e.target.value)}
                        maxLength={100}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="John Doe"
                        aria-label="Full name"
                      />
                    </div>

                    <div>
                      <label htmlFor="buyerEmail" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="buyerEmail"
                        value={buyerEmail}
                        onChange={(e) => setBuyerEmail(e.target.value)}
                        maxLength={254}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="john.doe@example.com"
                        aria-label="Email address"
                      />
                    </div>

                    <div>
                      <label htmlFor="buyerPhone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <PhoneInput
                        id="buyerPhone"
                        international
                        defaultCountry="US"
                        value={buyerPhone}
                        onChange={setBuyerPhone}
                        className="phone-input-custom"
                        placeholder="Enter phone number"
                        aria-label="Phone number"
                        error={buyerPhone ? (isValidPhoneNumber(buyerPhone) ? undefined : 'Invalid phone number') : undefined}
                      />
                      {buyerPhone && !isValidPhoneNumber(buyerPhone) && (
                        <p className="mt-1 text-sm text-red-600">
                          Please enter a valid phone number for the selected country.
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Address *
                      </label>
                      <textarea
                        id="deliveryAddress"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        maxLength={300}
                        required
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                        placeholder="123 Main St, New York, NY 10001"
                        aria-label="Delivery address"
                      />
                      <div className="mt-2 flex items-start bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-sm">
                          <p className="font-medium text-blue-900 mb-1">{POLICIES.deliveryRestriction.title}</p>
                          <p className="text-blue-800">{POLICIES.deliveryRestriction.message}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-6 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    aria-label="Continue to payment"
                  >
                    {isLoading ? 'Processing...' : 'Continue to Payment'}
                  </button>
                </form>
              </div>
            )}

            {step === 2 && clientSecret && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Payment</h2>
                  <button
                    type="button"
                    onClick={handleBackToDetails}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    aria-label="Back to details"
                  >
                    ← Back
                  </button>
                </div>
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <PaymentForm
                    clientSecret={clientSecret}
                    onSuccess={handlePaymentSuccess}
                  />
                </Elements>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                {items.map((item, index) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Bouquet #{index + 1} ({item.size})
                    </span>
                    <span className="text-gray-900 font-medium">
                      ${SIZES[item.size]?.price || 0}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 space-y-2 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-primary-600">${total.toFixed(2)}</span>
                </div>
              </div>

              {step === 1 && buyerFullName && deliveryAddress && (
                <div className="border-t pt-4 text-sm text-gray-600">
                  <div className="mb-2">
                    <span className="font-medium">Delivery Information:</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded space-y-1">
                    <p className="font-medium text-gray-900">{buyerFullName}</p>
                    {buyerEmail && <p>{buyerEmail}</p>}
                    {buyerPhone && <p>{buyerPhone}</p>}
                    <p className="mt-2">{deliveryAddress}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default CheckoutPage;


