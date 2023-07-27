import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../app/components/Navbar';

export default function Collection() {
  const router = useRouter();
  const { id } = router.query;

  const [collectionData, setCollectionData] = useState(null);

  useEffect(() => {
    // Fetch the user's collection data based on the ID
    const fetchCollectionData = async () => {
      try {
        const response = await fetch(`/collection/${id}`); // Replace with your API endpoint to fetch the collection data
        if (response.ok) {
          const data = await response.json();
          setCollectionData(data);
        } else {
          console.error('Failed to fetch collection data:', response.status);
        }
      } catch (error) {
        console.error('Failed to fetch collection data:', error);
      }
    };

    if (id) {
      fetchCollectionData();
    }
  }, [id]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-r from-red-500 to-purple-900">
        <div className="max-w-7xl mx-auto py-8 px-4">
          <h1 className="text-2xl font-bold mb-4">Collection</h1>
          <p className="text-white mb-4">User ID: {id}</p>
          {collectionData ? (
            <ul className="grid grid-cols-1 gap-6">
              {collectionData.map((comic) => (
                <li
                  key={comic.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden"
                >
                  <div className="p-4">
                    <h2 className="text-xl font-semibold mb-2">{comic.title}</h2>
                    <p className="text-gray-500">{comic.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-white">Loading collection data...</p>
          )}
        </div>
      </div>
    </>
  );
}
