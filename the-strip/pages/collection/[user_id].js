import React, { useEffect, useState, useContext } from "react";
import UserContext from "@/components/utils/UserContext";
import { useRouter } from "next/router";
import Navbar from "../../app/components/Navbar";

export default function CollectionsPage() {
  const router = useRouter();
  const { user_id } = router.query;
  const { user, updateUserContext } = useContext(UserContext);
  const [collectionData, setCollectionData] = useState(null);
  const [userCollection, setUserCollection] = useState([]);

  useEffect(() => {
    // Fetch the user's collection data based on the ID
    const fetchCollectionData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5555/collection/${user_id}`);
        if (response.ok) {
          const data = await response.json();
          setCollectionData(data);
          setUserCollection(data.map((comic) => comic.id));

          // Update the user context with the collection data
          updateUserContext({ ...user, collectionData: data });
        } else {
          console.error("Failed to fetch collection data:", response.status);
        }
      } catch (error) {
        console.error("Failed to fetch collection data:", error);
      }
    };

    if (user_id) {
      fetchCollectionData();
    }
  }, [user_id, user, updateUserContext]);

  

  const handleRemoveClick = async (comicId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5555/collection/${user_id}/${comicId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setCollectionData((prevData) =>
          prevData.filter((comic) => comic.id !== comicId)
        );
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
          <h1 className="text-3xl font-bold mb-4 text-white">Collection</h1>
          
          <p className="text-white mb-4">Hello {user?.name || "there"}</p>
          {collectionData ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {collectionData.map((comic) => (
                <div key={comic.id} className="bg-white rounded-lg shadow-lg">
                  <img
                    src={comic.image}
                    alt={comic.title}
                    className="w-full h-56 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <h2 className="text-xl font-semibold mb-2 text-black">{comic.title}</h2>
                    <p className="text-gray-600">{comic.comic_description}</p>
                  </div>
                  <div className="p-4 flex justify-end">
                    {/* Add the remove button with gradient background */}
                    <button
                      onClick={() => handleRemoveClick(comic.id)}
                      className="bg-gradient-to-r from-red-500 to-purple-600 text-white px-4 py-2 rounded"
                    >
                      Remove from Collection
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white">Loading collection data...</p>
          )}
        </div>
      </div>
    </>
  );
}
