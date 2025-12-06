import { useState, useEffect } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

const PaymentForm = ({ onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for Stripe and Elements to be ready
    if (stripe && elements) {
      setIsReady(true);
    }
  }, [stripe, elements]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      console.warn('⚠️ Stripe or Elements not ready');
      return;
    }

    if (!isReady) {
      setErrorMessage('Payment form is still loading. Please wait a moment.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    console.log('💳 Starting payment confirmation...');

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + '/order-summary',
        },
        redirect: 'if_required',
      });

      if (error) {
        console.error('❌ Payment error:', error);
        setErrorMessage(error.message);
        setIsProcessing(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('✅ Payment succeeded!', paymentIntent);
        onSuccess();
      } else {
        console.warn('⚠️ Unexpected payment status:', paymentIntent?.status);
        setErrorMessage('Payment processing failed. Please try again.');
        setIsProcessing(false);
      }
    } catch (err) {
      console.error('❌ Payment exception:', err);
      setErrorMessage(err.message || 'An unexpected error occurred. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <PaymentElement 
          onReady={() => {
            console.log('✅ Payment Element is ready');
            setIsReady(true);
          }}
          onLoadError={(error) => {
            console.error('❌ Payment Element load error:', error);
            setErrorMessage('Failed to load payment form. Please refresh the page.');
          }}
        />
      </div>

      {errorMessage && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{errorMessage}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || !isReady || isProcessing}
        className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        aria-label="Complete payment"
      >
        {!isReady && !isProcessing ? 'Loading payment form...' : isProcessing ? 'Processing Payment...' : 'Complete Payment'}
      </button>

      <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        <span>Secured by Stripe</span>
      </div>
    </form>
  );
};

export default PaymentForm;


