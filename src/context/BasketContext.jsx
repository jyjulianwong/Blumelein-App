import { createContext, useContext, useState, useEffect } from 'react';

const BasketContext = createContext();

export const useBasket = () => {
  const context = useContext(BasketContext);
  if (!context) {
    throw new Error('useBasket must be used within a BasketProvider');
  }
  return context;
};

export const BasketProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const savedItems = localStorage.getItem('basket');
    return savedItems ? JSON.parse(savedItems) : [];
  });

  useEffect(() => {
    localStorage.setItem('basket', JSON.stringify(items));
  }, [items]);

  const addItem = (item) => {
    const newItem = {
      ...item,
      id: `${Date.now()}-${Math.random()}`,
      createdAt: new Date().toISOString(),
    };
    setItems((prevItems) => [...prevItems, newItem]);
  };

  const removeItem = (itemId) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const updateItem = (itemId, updatedData) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === itemId ? { ...item, ...updatedData } : item))
    );
  };

  const clearBasket = () => {
    setItems([]);
    localStorage.removeItem('basket');
  };

  const getItemCount = () => {
    return items.length;
  };

  const value = {
    items,
    addItem,
    removeItem,
    updateItem,
    clearBasket,
    getItemCount,
  };

  return <BasketContext.Provider value={value}>{children}</BasketContext.Provider>;
};


