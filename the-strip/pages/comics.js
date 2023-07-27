import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../app/components/Navbar";

export default function Comics() {
  const router = useRouter();
  const [comics, setComics] = useState([]);

  useEffect(() => {
    const fetchComics = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5555/comics");
        if (response.ok) {
          const data = await response.json();
          setComics(data);
        } else {
          console.error("Error fetching comics:", response);
        }
      } catch (error) {
        console.error("Error fetching comics:", error);
      }
    };

    fetchComics();
  }, []);

  // Function to navigate to comic details page
  const handleComicClick = (comicId) => {
    router.push(`/comics/${comicId}`);
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-red-500 to-purple-900">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4 max-w-screen-sm">
          {comics.map((comic) => (
            <div
              key={comic.id}
              className="p-4 border rounded-lg cursor-pointer hover:shadow-md bg-white"
              onClick={() => handleComicClick(comic.id)} // Add onClick event
            >
              <h3 className="mt-2 text-lg font-semibold text-black">{comic.title}</h3>
              <img
                src={comic.image}
                alt={comic.title}
                className="w-full h-64 object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
