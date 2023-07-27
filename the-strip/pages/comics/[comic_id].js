import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../../app/components/Navbar";

export default function ComicDetails() {
  const router = useRouter();
  const { comic_id } = router.query;
  const [comic, setComic] = useState(null);
  const [isInCollection, setIsInCollection] = useState(false);

  useEffect(() => {
    const fetchComicDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5555/comics/${comic_id}`);
        if (response.ok) {
          const data = await response.json();
          setComic(data);
          checkIfInCollection(data.id); // Check if the comic is in the collection
        } else {
          console.error("Error fetching comic details:", response);
        }
      } catch (error) {
        console.error("Error fetching comic details:", error);
      }
    };

    if (comic_id) {
      fetchComicDetails();
    }
  }, [comic_id]);

  // Function to check if the comic is in the user's collection
  const checkIfInCollection = async (comicId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5555/collection/${comicId}`);
      if (response.ok) {
        const data = await response.json();
        setIsInCollection(data.isInCollection);
      } else {
        console.error("Error checking if comic is in collection:", response);
      }
    } catch (error) {
      console.error("Error checking if comic is in collection:", error);
    }
  };

  // Function to add the comic to the user's collection
  const addToCollection = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5555/collection/${comic.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comicId: comic.id }),
      });
      if (response.ok) {
        setIsInCollection(true);
      } else {
        console.error("Error adding comic to collection:", response);
      }
    } catch (error) {
      console.error("Error adding comic to collection:", error);
    }
  };

  // Function to remove the comic from the user's collection
  const removeFromCollection = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5555/collection/${comic.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setIsInCollection(false);
      } else {
        console.error("Error removing comic from collection:", response);
      }
    } catch (error) {
      console.error("Error removing comic from collection:", error);
    }
  };

  if (!comic) {
    return <p>Loading comic details...</p>;
  }

  return (
    <>
      <Navbar />
      <div
        className="flex justify-center items-center min-h-screen bg-gradient-to-r from-red-500 to-purple-900"
      >
        <div className="p-4 bg-white rounded shadow-md max-w-lg">
          <h1 className="text-2xl font-bold mb-4">{comic.title}</h1>
          <img
            src={comic.image}
            alt={comic.title}
            className="w-full h-64 object-contain mb-4 rounded-lg shadow-md"
          />
          <p>{comic.description}</p>
          {/* Add other components to display the detailed comic information */}
          <div className="mt-4">
            <h2 className="text-lg font-semibold">Additional Information</h2>
            <p>Comic ID: {comic.id}</p>
            {/* Add other comic details */}
          </div>
          {/* Add buttons for adding and removing from the collection */}
          <div className="mt-4">
            {isInCollection ? (
              <button
                onClick={removeFromCollection}
                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
              >
                Remove from Collection
              </button>
            ) : (
              <button
                onClick={addToCollection}
                className="bg-green-500 text-white px-4 py-2 rounded mr-2"
              >
                Add to Collection
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
