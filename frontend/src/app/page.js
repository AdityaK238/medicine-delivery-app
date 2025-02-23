import Link from 'next/link';
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
    <h1 className="text-4xl font-bold mb-6">Welcome to Medicine Store</h1>
    <Link href="/login" className="bg-blue-500 px-4 py-2 rounded">
      Login / Register
    </Link>
  </div>
  );
}
