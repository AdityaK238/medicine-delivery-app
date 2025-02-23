"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const DeliveryContent = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  if (!orderId) {
    return <p>⚠ Order ID is missing. Please provide a valid order.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🚚 Live Delivery Tracking</h1>
      <p>Tracking Order ID: <strong>{orderId}</strong></p>
    </div>
  );
};

const DeliveryPage = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <DeliveryContent />
    </Suspense>
  );
};

export default DeliveryPage;
