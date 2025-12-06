import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BasketProvider } from './context/BasketContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import BasketPage from './pages/BasketPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSummaryPage from './pages/OrderSummaryPage';
import config from './config';

const App = () => {
  // BrowserRouter basename should NOT have trailing slash
  const basename = config.clientBasePath;
  
  return (
    <Router basename={basename}>
      <BasketProvider>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/basket" element={<BasketPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-summary/:orderId" element={<OrderSummaryPage />} />
          </Routes>
        </div>
      </BasketProvider>
    </Router>
  );
};

export default App;


