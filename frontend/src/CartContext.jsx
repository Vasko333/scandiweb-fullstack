// src/CartContext.jsx
import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    setCartItems((prev) => {
      const existingItem = prev.find((i) => i.id === item.id);
  
      // Auto-initialize selected attributes if missing
      const defaultSelectedAttributes = {};
      item.attributes?.forEach(attr => {
        defaultSelectedAttributes[attr.name] = attr.items[0]?.value; // select first option as default
      });
  
      const newItem = {
        ...item,
        quantity: 1,
        selectedAttributes: item.selectedAttributes || defaultSelectedAttributes,
      };
  
      if (existingItem) {
        return prev.map((i) =>
          i.id === item.id
            ? {
                ...i,
                quantity: i.quantity + 1,
                selectedAttributes: { ...i.selectedAttributes, ...newItem.selectedAttributes }, // merge
              }
            : i
        );
      }
  
      return [...prev, newItem];
    });
  };
  

  const updateQuantity = (id, change) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + change) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const updateAttribute = (id, attrName, value) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              selectedAttributes: { ...item.selectedAttributes, [attrName]: value },
            }
          : item
      )
    );
  };

  const getTotalItems = () => cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, updateQuantity, updateAttribute, getTotalItems }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);