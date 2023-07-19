import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../app/components/Navbar';

export default function Collection() {
  const router = useRouter();
  const { user_id } = router.query;

  const [collectionData, setCollectionData] = useState(null);

  useEffect(() => {
    // Fetch the user's collection data based on the ID
    const fetchCollectionData = async () => {
      try {
        //todo Change to use UserContext
        const userId = localStorage.getItem('user_id'); // Retrieve user ID from local storage
        const response = await fetch(`http://127.0.0.1:5555/collection`); // Replace with your API endpoint to fetch the collection data
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

    if (user_id) {
      fetchCollectionData();
    }
  }, [user_id]);

  function handleAddToCollection(){
    // POST to endpoint '/collection' with user_email that //todo we stored in UserContext during login
    // Tell user they added it (ie change color and text of the add button if stored)
  }


  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-r from-red-500 to-purple-900">
        <div className="max-w-7xl mx-auto py-8 px-4">
          <h1 className="text-2xl font-bold mb-4">Collection</h1>
          <p className="text-white mb-4">User ID: {user.id}</p>
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
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                      onClick={() => handleAddToCollection(comic.id)}
                    >
                      Add to Collection
                    </button>
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
