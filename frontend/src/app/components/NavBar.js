"use client";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const handleLogout = async () => {
    await logout();  
    router.push("/login"); 
  };

  return (
    <nav className="bg-gray-800 p-4 fixed top-0 w-full flex justify-between items-center shadow-lg">
      <h1 className="text-xl font-bold text-white">MediStore</h1>
      <div className="space-x-4">
        <Link href="/medicines" className="text-white hover:text-gray-300">Medicines</Link>
        <Link href="/pages/cart" className="text-white hover:text-gray-300">Cart</Link>
        <Link href="/pages/orders" className="text-white hover:text-gray-300">Orders</Link>
        <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded hover:bg-red-700">
          Logout
        </button>
      </div>
    </nav>
  );
}




