import React, { useEffect, useState, useContext } from "react";
import UserContext from "@/components/utils/UserContext";
import { useRouter } from "next/router";
import Navbar from "../../app/components/Navbar";
import Collection from "@/components/Collection";

export default function CollectionsPage() {
  const router = useRouter();
  const { user_id } = router.query;
  const { user } = useContext(UserContext);
  const [collectionData, setCollectionData] = useState(null);

  useEffect(() => {
    // Fetch the user's collection data based on the ID
    const fetchCollectionData = async () => {
      try {
        await fetch(`http://127.0.0.1:5555/collection/${user_id}`)
          .then((r) => r.json())
          .then((data) => {
            setCollectionData(data);
          });
      } catch (error) {
        console.error("Failed to fetch collection data:", error);
      }
    };

    if(collectionData){
      // store data in the user context
    }

    if (user_id) {
      fetchCollectionData();
    }
  }, [user_id]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-r from-red-500 to-purple-900">
        <div className="max-w-7xl mx-auto py-8 px-4">
          <h1 className="text-2xl font-bold mb-4">Collection</h1>
          <p className="text-white mb-4">User ID: {user_id}</p>
          {collectionData ? (
            <Collection comics={collectionData}/>
          ) : (
            <p className="text-white">Loading collection data...</p>
          )}
        </div>
      </div>
    </>
  );
}
