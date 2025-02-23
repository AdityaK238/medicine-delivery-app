"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const pathname = usePathname(); // Get the current path

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("https://medicine-delivery-app-9e0j.onrender.com/api/orders");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("❌ Error fetching orders:", error);
      }
    };

    fetchOrders();

    const socket = new WebSocket(
      `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.hostname}:5000`
    );

    socket.onmessage = (event) => {
      setOrders(JSON.parse(event.data));
    };

    return () => socket.close();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📦 Order History</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-700 text-white">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="p-2 border">Order ID</th>
              <th className="p-2 border">Transaction ID</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Medicines</th>
              <th className="p-2 border">Live Tracking</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.orderId} className="border text-center">
                <td className="p-2 border">{order.orderId}</td>
                <td className="p-2 border">{order.transactionId}</td>
                <td className="p-2 border">₹{order.amount}</td>
                <td className="p-2 border">
                  {order.medicines.map((med) => (
                    <div key={med.name}>
                      {med.name} (₹{med.price}) × {med.quantity}
                    </div>
                  ))}
                </td>
                <td className="p-2 border">
                  <a
                    href={`/tracking?orderId=${order.orderId}`} // Static href instead of router.push
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Track 🚚
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Orders;
