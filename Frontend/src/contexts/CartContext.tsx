// src/contexts/CartContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface CartItem {
  id_usuario: number; // ID del usuario
  id_producto: number; // ID del producto
  cantidad: number; // Cantidad del producto
  tipo_pago: string; // Tipo de pago
  meses?: number | null; // Meses 
}


interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (item: CartItem) => void; 
  fetchCartCount: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const {isLoggedIn, user} = useAuth();

  const addToCart = (item: CartItem) => {
    if (!item || !item.id_usuario || !item.id_producto || item.cantidad <= 0) {
      console.error('Invalid item data:', item);
      return; // Evita agregar un producto inválido
    }

    setCartItems((prevItems) => [...prevItems, item]); 
    setCartCount((prevCount) => prevCount + item.cantidad);
  };

  const fetchCartCount = async () => {
    if (isLoggedIn) {
      try {
        const token = localStorage.getItem('token');
        const userId = user?.id_usuario; 
  
        const response = await fetch('http://localhost:3001/cart-count', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'id_usuario': userId ? userId.toString() : '', 
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch cart count');
        }
  
        const data = await response.json();
        setCartCount(data.count);
      } catch (error) {
        console.error('Error fetching cart count:', error);
        setCartCount(0);
      }
    } else {
      setCartCount(0);
    }
  };

  useEffect(() => {
        fetchCartCount();
  }, [isLoggedIn, user]);

  return (
    <CartContext.Provider value={{ cartItems, cartCount, addToCart, fetchCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};