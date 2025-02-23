"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"; 

const Payment = () => {
  const searchParams = useSearchParams();
  const total = searchParams.get("total"); // Get total price from URL
  const [orderId, setOrderId] = useState(null);

  // Function to create order
  const createOrder = async () => {
    try {
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      });

      const data = await response.json();
      setOrderId(data.orderId);
      return data.orderId;
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  // Function to initiate Razorpay payment
  const handlePayment = async () => {
    const orderId = await createOrder();
    if (!orderId) return alert("Failed to create order!");

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use public key
      amount: total * 100,
      currency: "INR",
      name: "Your Store",
      description: "Payment for items",
      order_id: orderId,
      handler: function (response) {
        alert("Payment Successful!");
        console.log("Payment ID:", response.razorpay_payment_id);
      },
      prefill: {
        name: "Aditya", // Auto-filled name
        email: "aditya@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg max-w-lg mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">💳 Choose Payment Method</h2>
      <p className="text-yellow-400 mb-4">Total Amount: ₹{total}</p>
      <button
        className="w-full bg-blue-500 p-3 rounded-md hover:bg-blue-600"
        onClick={handlePayment}
      >
        Proceed to Pay
      </button>
    </div>
  );
};

export default Payment;
