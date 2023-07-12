import React from 'react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/">
                <a className="text-white font-bold text-xl">The Strip</a>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/comics">
                  <a className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    Comics
                  </a>
                </Link>
                {/* Add more links as needed */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
