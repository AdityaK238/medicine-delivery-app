"use client";

import { useEffect, useState } from "react";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Retrieve orders from localStorage
    const storedOrders = JSON.parse(localStorage.getItem("orderHistory")) || [];
    setOrders(storedOrders);
  }, []);

  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg shadow-lg mt-4">
      <h2 className="text-xl font-bold mb-2">📜 Order History</h2>
      {orders.length === 0 ? (
        <p className="text-gray-400">No past orders.</p>
      ) : (
        <ul>
          {orders.map((order, index) => (
            <li key={index} className="bg-gray-800 p-4 rounded-md my-2">
              ✅ {order.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderHistory;
