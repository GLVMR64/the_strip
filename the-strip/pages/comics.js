import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../app/components/Navbar";

export default function Comics() {
  const router = useRouter();
  const [comics, setComics] = useState([]);

  useEffect(() => {
    const fetchComics = async () => {
      try {
        const response = await fetch("http://localhost:5555/comics");
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {comics.map((comic) => (
          <div
            key={comic.id}
            className="p-4 border rounded-lg cursor-pointer hover:shadow-md"
            onClick={() => handleComicClick(comic.id)} // Add onClick event
          >
            <img
              src={comic.image}
              alt={comic.title}
              className="w-full h-64 object-contain"
            />
            <h3 className="mt-2 text-lg font-semibold">{comic.title}</h3>
          </div>
        ))}
      </div>
    </>
  );
}
