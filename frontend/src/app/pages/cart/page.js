"use client";

import { useState, useEffect } from "react";
import Cart from "../../components/Cart";

const cart = () => {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage when component mounts
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleCheckout = () => {
    if (totalPrice > 0) {
      router.push(`/payment?total=${totalPrice}`); // Redirect to payment page
    } else {
      alert("Your cart is empty!");
    }
  };
  
  // Function to add an item to the cart immediately
  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);

      if (existingItem) {
        // Increase quantity if the item already exists
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        // Add new item with quantity = 1
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🛒 Your Cart</h2>
      {/* Pass addToCart function to allow adding items */}
      <Cart cart={cart} setCart={setCart} addToCart={addToCart} />
    </div>
  );
};

export default cart;
