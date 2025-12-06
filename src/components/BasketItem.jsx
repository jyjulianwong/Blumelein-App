import { useState } from 'react';

const SIZES = {
  S: { label: 'Small', price: 35 },
  M: { label: 'Medium', price: 55 },
  L: { label: 'Large', price: 85 },
};

const BasketItem = ({ item, onRemove }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const sizeData = SIZES[item.size];

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleRemove = () => {
    if (window.confirm('Are you sure you want to remove this item from your basket?')) {
      onRemove(item.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-2xl" role="img" aria-label="bouquet">💐</span>
            <h3 className="text-lg font-semibold text-gray-900">
              {sizeData.label} Bouquet
            </h3>
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
                <button
                  type="button"
                  onClick={handleToggleExpand}
                  className="text-sm font-medium text-primary-600 hover:text-primary-700 focus:outline-none"
                  aria-label={isExpanded ? 'Hide comments' : 'Show comments'}
                >
                  {isExpanded ? '▼ Hide' : '▶ View'} Comments
                </button>
                {isExpanded && (
                  <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    {item.comments}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end ml-4">
          <span className="text-xl font-bold text-gray-900 mb-3">
            ${sizeData.price}
          </span>
          <button
            type="button"
            onClick={handleRemove}
            className="text-red-600 hover:text-red-700 focus:outline-none p-2"
            aria-label="Remove item from basket"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BasketItem;


