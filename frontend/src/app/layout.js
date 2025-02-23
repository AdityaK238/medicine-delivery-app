import "./styles/global.css";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/NavBar";
import Script from "next/script";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-black min-h-screen">
        <AuthProvider>
          <Navbar />
        </AuthProvider>
        {children}

        {/* Load Razorpay SDK in the body */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
