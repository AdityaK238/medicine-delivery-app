"use client";

import LiveLocation from "@/components/LiveLocation"; // Import LiveLocation component
import { useSearchParams } from "next/navigation";

const DeliveryPage = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  if (!orderId) {
    return <p>⚠ Order ID is missing. Please provide a valid order.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🚚 Live Delivery Tracking</h1>
      <LiveLocation orderId={orderId} /> {/* Show Live Map */}
      <p>Tracking Order ID: <strong>{orderId}</strong></p>
    </div>
  );
};

export default DeliveryPage;
