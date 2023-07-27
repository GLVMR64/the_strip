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
        const response = await fetch(`http://localhost:5555/comics/${comic_id}`);
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
  const toggleInCollection = async () => {
    if (isInCollection) {
      removeFromCollection();
    } else {
      addToCollection();
    }
  };

  return (
    <>
      <Navbar />
      <div
        className="flex justify-center items-center min-h-screen bg-gradient-to-r from-red-500 to-purple-900"
      >
        <div className="p-4 bg-white rounded shadow-md max-w-lg">
          <h1 className="text-2xl font-bold mb-4 text-black">{comic.title}</h1>
          <div className="flex flex-col items-center">
            <img
              src={comic.image}
              alt={comic.title}
              className="w-full h-64 object-contain mb-4 rounded-lg shadow-md"
            />
            <p className="text-center text-black">{comic.description}</p>
          </div>
          {/* Add other components to display the detailed comic information */}
          <div className="mt-4">
            {/* Toggle the button text based on isInCollection state */}
            <button
              onClick={toggleInCollection}
              className={`${
                isInCollection ? "bg-red-500" : "bg-green-500"
              } text-black px-4 py-2 rounded mr-2`}
            >
              {isInCollection ? "Remove from Collection" : "Add to Collection"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
