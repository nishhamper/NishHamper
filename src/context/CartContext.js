import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        loadCart(user.uid);
      } else {
        setCartItems([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadCart = async (uid) => {
    const cartRef = doc(db, 'carts', uid);
    const docSnap = await getDoc(cartRef);
    if (docSnap.exists()) {
      setCartItems(docSnap.data().items || []);
    } else {
      setCartItems([]);
    }
  };

  const saveCart = async (items) => {
    if (!currentUser) return;

    const cartRef = doc(db, 'carts', currentUser.uid);
    await setDoc(cartRef, {
      items,
      userEmail: currentUser.email,
      userName: currentUser.displayName || 'Anonymous',
    });
  };

  const addToCart = (product) => {
    if (!currentUser) {
      alert('Please log in to add items to your cart.');
      return;
    }

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      let updatedCart;
      if (existingItem) {
        updatedCart = prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [...prevItems, { ...product, quantity: 1 }];
      }
      saveCart(updatedCart);
      return updatedCart;
    });
  };

  const removeFromCart = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    saveCart(updated);
  };

  const updateCart = (product, action) => {
    let updatedCart = cartItems.map((item) =>
      item.id === product.id
        ? {
            ...item,
            quantity:
              action === 'increase'
                ? item.quantity + 1
                : Math.max(item.quantity - 1, 1),
          }
        : item
    );
    setCartItems(updatedCart);
    saveCart(updatedCart);
  };

  const clearCart = () => {
    setCartItems([]);
    saveCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateCart,
        clearCart, // ✅ make sure this is included
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
