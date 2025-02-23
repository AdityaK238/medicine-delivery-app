"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AiOutlineInfoCircle } from "react-icons/ai";
import medicinesData from "../../../data/medicines.json";

const getUniqueMedicines = (meds) => {
  return Array.from(new Map(meds.map((m) => [m.id, m])).values());
};

const uniqueMedicines = getUniqueMedicines(medicinesData);

function MedicineList() {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated")); // Update navbar count
  };

  const addToCart = (medicine) => {
    let updatedCart = [...cart];
    const existingItem = updatedCart.find((item) => item.id === medicine.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      updatedCart.push({ ...medicine, quantity: 1 });
    }

    updateCart(updatedCart);
  };

  const removeFromCart = (medicine) => {
    let updatedCart = [...cart];
    const existingItemIndex = updatedCart.findIndex((item) => item.id === medicine.id);

    if (existingItemIndex !== -1) {
      if (updatedCart[existingItemIndex].quantity > 1) {
        updatedCart[existingItemIndex].quantity -= 1;
      } else {
        updatedCart = updatedCart.filter((item) => item.id !== medicine.id); // Remove medicine entirely
      }
    }

    updateCart(updatedCart);
  };

  const getMedicineCount = (id) => {
    const item = cart.find((med) => med.id === id);
    return item ? item.quantity : 0;
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-white">Available Medicines</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {uniqueMedicines.map((med) => (
          <div key={med.id} className="bg-gray-800 p-4 rounded-lg shadow-lg relative">
            <Image 
              src={med.image} 
              alt={med.name} 
              width={300} 
              height={200} 
              className="rounded-md object-cover w-[450px] h-[200px]" 
              priority 
            />
            <h3 className="text-lg font-semibold mt-2 text-white">{med.name}</h3>
            <p className="text-gray-400">{med.description}</p>
            <p className="mt-2 font-bold text-yellow-500">₹{med.price}</p>

            <div className="flex items-center mt-4 space-x-2">
              <button
                onClick={() => removeFromCart(med)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                -
              </button>
              <span className="text-white font-bold">{getMedicineCount(med.id)}</span>
              <button
                onClick={() => addToCart(med)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MedicineList;
