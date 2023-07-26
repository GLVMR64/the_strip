import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../app/components/Navbar";

export default function ComicDetails() {
  const router = useRouter();
  const { comic_id } = router.query;
  const [comic, setComic] = useState(null);

  useEffect(() => {
    const fetchComicDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5555/comics/${comic_id}`);
        if (response.ok) {
          const data = await response.json();
          setComic(data);
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

  if (!comic) {
    return <p>Loading comic details...</p>;
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center mt-4">
        <h1 className="text-2xl font-bold">{comic.title}</h1>
        <img src={comic.image} alt={comic.title} className="mt-4 rounded-lg shadow-md" />
        <p className="mt-4">{comic.description}</p>
        {/* Add other components to display the detailed comic information */}
      </div>
    </>
  );
}
