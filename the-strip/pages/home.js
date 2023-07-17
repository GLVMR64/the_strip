import React from 'react';
import Navbar from '../app/components/Navbar';
import Login from './login';
import 'tailwindcss/tailwind.css';

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-red-500 to-purple-900">
        <div className="p-6 text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Welcome to The Strip!</h1>
          <p className="text-lg">Discover a world of amazing comics.</p>
        </div>
      </div>
    </>
  );
}
