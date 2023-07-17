import React from 'react';
import Link from 'next/link';
import 'tailwindcss/tailwind.css';

export default function Navbar() {
  // Replace with actual user data
  const user = {
    id: 123,
    name: 'John Doe',
    // Add other user properties as needed
  };

  return (
    <nav className="bg-black py-4">
      <ul className="flex items-center justify-between max-w-7xl mx-auto px-4">
        <li>
          <Link href="/">
            <span className="text-white text-xl font-bold cursor-pointer">Home</span>
          </Link>
        </li>
        <li>
          <Link href="/comics">
            <span className="text-white text-xl font-bold cursor-pointer">Comics</span>
          </Link>
        </li>
        <li>
          <Link href={`/collections/${user.id}`}>
            <span className="text-white text-xl font-bold cursor-pointer">My Collection</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
