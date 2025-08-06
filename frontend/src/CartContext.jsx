// src/CartContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);


  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setCartItems(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);
  
  const addToCart = (item) => {
    setCartItems((prev) => {
      // Auto-initialize selected attributes if missing
      const defaultSelectedAttributes = {};
      item.attributes?.forEach(attr => {
        defaultSelectedAttributes[attr.name] = attr.items[0]?.value;
      });
  
      const selectedAttributes = item.selectedAttributes || defaultSelectedAttributes;
  
      // Generate unique key: product ID + selected attributes
      const itemKey = `${item.id}-${JSON.stringify(selectedAttributes)}`;
  
      // Check for existing item with same key
      const existingItem = prev.find((i) =>
        `${i.id}-${JSON.stringify(i.selectedAttributes)}` === itemKey
      );
  
      const newItem = {
        ...item,
        quantity: 1,
        selectedAttributes,
      };
  
      if (existingItem) {
        return prev.map((i) =>
          `${i.id}-${JSON.stringify(i.selectedAttributes)}` === itemKey
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
  
      return [...prev, newItem];
    });
  };
  
  

  const updateQuantity = (id, selectedAttributes, change) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id &&
          JSON.stringify(item.selectedAttributes) === JSON.stringify(selectedAttributes)
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };
  
  
  const updateAttribute = (id, selectedAttributes, attrName, value) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id &&
        JSON.stringify(item.selectedAttributes) === JSON.stringify(selectedAttributes)
          ? {
              ...item,
              selectedAttributes: { ...item.selectedAttributes, [attrName]: value },
            }
          : item
      )
    );
  };
  
  const removeFromCart = (id, selectedAttributes) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          item.id !== id ||
          JSON.stringify(item.selectedAttributes) !== JSON.stringify(selectedAttributes)
      )
    );
  };
  
  const getTotalItems = () => cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, updateQuantity, updateAttribute, removeFromCart, getTotalItems }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);