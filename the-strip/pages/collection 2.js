import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../app/components/Navbar';

export default function Collection() {
  const router = useRouter();
  const { id } = router.query;

  const [collectionData, setCollectionData] = useState(null);
  const [userCollection, setUserCollection] = useState([]);

  useEffect(() => {
    // Fetch the user's collection data based on the ID
    const fetchCollectionData = async () => {
      try {
        const response = await fetch(`/collection/${user_id}`);
        if (response.ok) {
          const data = await response.json();
          setCollectionData(data);
          setUserCollection(data.map((comic) => comic.id));
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

  // Function to add the comic to the user's collection
  const addToCollection = async (comicId) => {
    try {
      const response = await fetch(`/collection/${comicId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comicId }),
      });
      if (response.ok) {
        setUserCollection([...userCollection, comicId]); // Update the userCollection state with the new comicId
      } else {
        console.error('Error adding comic to collection:', response);
      }
    } catch (error) {
      console.error('Error adding comic to collection:', error);
    }
  };

  // Function to remove the comic from the user's collection
  const removeFromCollection = async (comicId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5555/collection/${comicId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setUserCollection(userCollection.filter((id) => id !== comicId)); // Remove the comicId from the userCollection state
      } else {
        console.error('Error removing comic from collection:', response);
      }
    } catch (error) {
      console.error('Error removing comic from collection:', error);
    }
  };

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
                <li key={comic.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="p-4">
                    <h2 className="text-xl font-semibold mb-2">{comic.title}</h2>
                    <p className="text-gray-500">{comic.description}</p>
                  </div>
                  <div className="p-4">
                    {userCollection.includes(comic.id) ? (
                      <>
                        <button
                          onClick={() => removeFromCollection(comic.id)}
                          className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                        >
                          Remove from Collection
                        </button>
                        <button
                          // Add any other functionality you want for the comic
                          className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                          View Details
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => addToCollection(comic.id)}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                      >
                        Add to Collection
                      </button>
                    )}
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
