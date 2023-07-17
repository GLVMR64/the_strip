import React, { useEffect, useState } from 'react';
import Navbar from '../app/components/Navbar';
import axios from 'axios';

export default function Comics() {
  const [comics, setComics] = useState([]);

  useEffect(() => {
    async function fetchComics() {
      try {
        const response = await fetch('http://127.0.0.1:5555/comics');
        const data = await response.json();
        setComics(data);
      } catch (error) {
        console.error('Error fetching comics:', error);
        setComics([]);
      }
    }

    fetchComics();
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex flex-wrap items-center justify-center min-h-screen bg-gradient-to-r from-red-500 to-purple-900">
        {comics.map((comic) => (
          <div
            key={comic.id}
            className="max-w-sm mx-4 mb-4 bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer"
            style={{ backgroundImage: `url(${comic.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
        ))}
      </div>
    </>
  );
}
