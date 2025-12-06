import ItemConfigurator from '../components/ItemConfigurator';
import SEO from '../components/SEO';
import { getSEOConfig } from '../config/seoConfig';

const HomePage = () => {
  const seoConfig = getSEOConfig('home');
  
  return (
    <>
      <SEO {...seoConfig} />
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-handwriting text-gray-900 mb-4">
            Create Your Perfect Bouquet
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Customize a beautiful flower arrangement with your choice of size, colours, and special requests. 
            Each bouquet is carefully crafted with love.
          </p>
        </div>

        {/* Configurator */}
        <ItemConfigurator />

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6">
            <div className="text-4xl mb-3">🌺</div>
            <h3 className="font-handwriting text-xl text-gray-900 mb-2">Fresh Flowers</h3>
            <p className="text-sm text-gray-600">
              We use only the freshest flowers for every arrangement
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-3">🎨</div>
            <h3 className="font-handwriting text-xl text-gray-900 mb-2">Custom Designs</h3>
            <p className="text-sm text-gray-600">
              Tailor your bouquet to match any occasion or preference
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-3">🚚</div>
            <h3 className="font-handwriting text-xl text-gray-900 mb-2">Fast Delivery</h3>
            <p className="text-sm text-gray-600">
              Quick and careful delivery right to your doorstep
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default HomePage;


