import React, { useEffect, useState, useContext } from "react";
import UserContext from "@/components/utils/UserContext";
import { useRouter } from "next/router";
import Navbar from "../../app/components/Navbar";

export default function CollectionsPage() {
  const router = useRouter();
  const { user_id } = router.query;
  const { user, updateUserContext } = useContext(UserContext); // Add updateUserContext to access the function to update user context
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

  // Function to add the comic to the user's collection
  const addToCollection = async (comicId) => {
    // Implement the logic to add a comic to the user's collection
  };

  // Function to remove the comic from the user's collection
  const removeFromCollection = async (comicId) => {
    // Implement the logic to remove a comic from the user's collection
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-r from-red-500 to-purple-900">
        <div className="max-w-7xl mx-auto py-8 px-4">
          <h1 className="text-2xl font-bold mb-4">Collection</h1>
          <p className="text-white mb-4">Hello {user_id}</p>
          {collectionData ? (
            <ul className="grid grid-cols-1 gap-6">
              {collectionData.map((comic) => (
                <li key={comic.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  {/* Render each comic item in the user's collection */}
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
