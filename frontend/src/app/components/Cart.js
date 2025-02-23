"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Cart = ({ cart, setCart }) => {
  const router = useRouter();
  const [proceedToPayment, setProceedToPayment] = useState(false);

  useEffect(() => {
    setCart((prevCart) =>
      prevCart.map((item) => ({
        ...item,
        quantity: item.quantity ?? 1,
      }))
    );
  }, []);

  const increaseQuantity = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const totalPrice = cart.reduce(
    (acc, item) => acc + (item.price ?? 0) * (item.quantity ?? 1),
    0
  );

  const handleProceedToPayment = () => {
    if (totalPrice > 0) {
      setProceedToPayment(true);
    } else {
      alert("Your cart is empty!");
    }
  };
  const handleRazorpayPayment = async () => {
    try {
      if (typeof window === "undefined" || !window.Razorpay) {
        alert("❌ Razorpay SDK is not loaded. Please refresh the page.");
        return;
      }
  
      const orderResponse = await fetch("http://localhost:5000/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalPrice }), // Amount in ₹
      });
  
      const orderData = await orderResponse.json();
  
      if (!orderData || !orderData.orderId) {
        throw new Error("Failed to create Razorpay order.");
      }
  
      console.log("✅ Order Created on Backend:", orderData);
  
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY, // Make sure it's the live key
        amount: orderData.amount, // Amount in paise (₹500)
        currency: "INR",
        name: "Medicine-deivery-app",
        description: "Order #12345",
        image: "/logo.png",
        order_id: orderData.orderId, // Created from backend
        method: "upi",
        upi: {
          flow: "collect", // Try changing to "intent"
        },
        handler: function (response) {
          console.log(response);
          alert("Payment Successful");
        },
        prefill: {
          email: "customer@example.com",
          contact: "1234567890",
        },
        theme: {
          color: "#3399cc",
        },
      };
      const razorpay = new Razorpay(options);
      razorpay.open();
      
    } catch (error) {
      console.error("❌ Payment Error:", error);
      alert("Payment failed. Try again.");
    }
  };
  
  
  
  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg mt-4 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">🛒 Your Cart</h2>
      {cart.length === 0 ? (
        <p className="text-gray-400">Your cart is empty.</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-gray-800 p-3 rounded-md my-2"
            >
              <div>
                <span className="font-semibold">{item.name}</span> - ₹{item.price} &nbsp;&nbsp;
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className="bg-red-500 px-3 py-1 rounded-md hover:bg-red-600"
                  onClick={() => decreaseQuantity(item.id)}
                >
                  -
                </button>
                <span className="text-lg font-bold">{item.quantity}</span>
                <button
                  className="bg-green-500 px-3 py-1 rounded-md hover:bg-green-600"
                  onClick={() => increaseQuantity(item.id)}
                >
                  +
                </button>
              </div>
            </div>
          ))}
          <h3 className="mt-4 font-bold text-yellow-500">Total: ₹{totalPrice}</h3>

          {!proceedToPayment ? (
            <button
              className="w-full bg-blue-500 p-2 rounded-md mt-4 hover:bg-blue-600"
              onClick={handleProceedToPayment}
            >
              Proceed to Payment
            </button>
          ) : (
            <div className="mt-4">
              <h3 className="text-lg font-bold mb-2">Choose Payment Method:</h3>
              <button className="w-full bg-orange-500 p-2 rounded-md mb-2 hover:bg-orange-600"
                onClick={handleRazorpayPayment}
              >Pay via RazorPay</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;
