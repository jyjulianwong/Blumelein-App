import { useState } from 'react';
import { useBasket } from '../context/BasketContext';

const SIZES = [
  { value: 'S', label: 'Small', description: 'Perfect for a desk or small table', price: 35 },
  { value: 'M', label: 'Medium', description: 'Ideal for most occasions', price: 55 },
  { value: 'L', label: 'Large', description: 'Makes a grand statement', price: 85 },
];

const COLOURS = [
  { value: 'red', label: 'Red', hex: '#EF4444' },
  { value: 'pink', label: 'Pink', hex: '#EC4899' },
  { value: 'white', label: 'White', hex: '#F9FAFB' },
  { value: 'yellow', label: 'Yellow', hex: '#F59E0B' },
  { value: 'orange', label: 'Orange', hex: '#F97316' },
  { value: 'purple', label: 'Purple', hex: '#A855F7' },
  { value: 'blue', label: 'Blue', hex: '#3B82F6' },
  { value: 'lavender', label: 'Lavender', hex: '#C4B5FD' },
];

const ItemConfigurator = () => {
  const { addItem } = useBasket();
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColours, setSelectedColours] = useState([]);
  const [comments, setComments] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleColourToggle = (colourValue) => {
    setSelectedColours((prev) => {
      if (prev.includes(colourValue)) {
        return prev.filter((c) => c !== colourValue);
      }
      return [...prev, colourValue];
    });
  };

  const handleAddToBasket = () => {
    if (selectedColours.length === 0) {
      alert('Please select at least one colour for your bouquet.');
      return;
    }

    const item = {
      size: selectedSize,
      main_colours: selectedColours,
      comments: comments.trim() || null,
    };

    addItem(item);
    
    // Reset form
    setSelectedColours([]);
    setComments('');
    
    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const selectedSizeData = SIZES.find((s) => s.value === selectedSize);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
      <h2 className="text-2xl font-handwriting text-gray-900 mb-6">Create Your Custom Bouquet</h2>
      
      {/* Size Selection */}
      <div className="mb-8">
        <label className="block text-lg font-semibold text-gray-900 mb-4">
          Select Size
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SIZES.map((size) => (
            <button
              key={size.value}
              type="button"
              onClick={() => setSelectedSize(size.value)}
              className={`p-4 border-2 rounded-lg transition-all ${
                selectedSize === size.value
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-300'
              }`}
              aria-label={`Select ${size.label} size`}
            >
              <div className="text-left">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{size.label}</h3>
                  <span className="text-lg font-bold text-primary-600">${size.price}</span>
                </div>
                <p className="text-sm text-gray-600">{size.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Colour Selection */}
      <div className="mb-8">
        <label className="block text-lg font-semibold text-gray-900 mb-4">
          Select Colours {selectedColours.length > 0 && (
            <span className="text-sm text-gray-600 font-normal">
              ({selectedColours.length} selected)
            </span>
          )}
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {COLOURS.map((colour) => {
            const isSelected = selectedColours.includes(colour.value);
            return (
              <button
                key={colour.value}
                type="button"
                onClick={() => handleColourToggle(colour.value)}
                className={`p-3 border-2 rounded-lg transition-all flex items-center space-x-3 ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
                aria-label={`${isSelected ? 'Deselect' : 'Select'} ${colour.label} colour`}
              >
                <div
                  className={`w-8 h-8 rounded-full border-2 ${
                    colour.value === 'white' ? 'border-gray-300' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: colour.hex }}
                />
                <span className="text-sm font-medium text-gray-900">{colour.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Comments */}
      <div className="mb-8">
        <label htmlFor="comments" className="block text-lg font-semibold text-gray-900 mb-4">
          Additional Comments <span className="text-sm text-gray-600 font-normal">(Optional)</span>
        </label>
        <textarea
          id="comments"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          maxLength={500}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          placeholder="Any special requests? (e.g., 'Please include roses and lilies')"
          aria-label="Additional comments for your bouquet"
        />
        <div className="mt-1 text-sm text-gray-500 text-right">
          {comments.length}/500 characters
        </div>
      </div>

      {/* Summary and Add to Basket */}
      <div className="border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold text-gray-900">Estimated Price:</span>
          <span className="text-2xl font-bold text-primary-600">
            ${selectedSizeData?.price || 0}
          </span>
        </div>
        <button
          type="button"
          onClick={handleAddToBasket}
          className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-colors focus:ring-4 focus:ring-primary-300"
          aria-label="Add bouquet to basket"
        >
          Add to Basket
        </button>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium text-center">
            ✓ Item added to basket successfully!
          </p>
        </div>
      )}
    </div>
  );
};

export default ItemConfigurator;


