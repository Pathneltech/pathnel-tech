import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.find(i => i.id === action.product.id);
      if (existing) {
        return state.map(i => i.id === action.product.id ? { ...i, qty: i.qty + (action.qty || 1) } : i);
      }
      return [...state, { ...action.product, qty: action.qty || 1 }];
    }
    case 'REMOVE': return state.filter(i => i.id !== action.id);
    case 'UPDATE_QTY': return state.map(i => i.id === action.id ? { ...i, qty: Math.max(1, action.qty) } : i);
    case 'CLEAR': return [];
    default: return state;
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, [], () => {
    try { return JSON.parse(localStorage.getItem('pt_cart')) || []; } catch { return []; }
  });

  useEffect(() => { localStorage.setItem('pt_cart', JSON.stringify(cart)); }, [cart]);

  const total = cart.reduce((sum, i) => sum + (i.sale_price || i.price) * i.qty, 0);
  const count = cart.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider value={{ cart, dispatch, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
