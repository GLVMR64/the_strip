import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../app/components/Navbar';
import axios from 'axios';

export default function ComicDetails() {
    const router = useRouter();
    const { comic_id } = router.query;
    const [comic, setComic] = useState(null);
  
    useEffect(() => {
      const fetchComicDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:5555/comics/${comic_id}`);
          setComic(response.data);
        } catch (error) {
          console.error('Error fetching comic details:', error);
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
      <div>
        <h1>{comic.title}</h1>
        <img src={comic.image_url} alt={comic.title} />
        <p>{comic.description}</p>
        {/* Add the button to add/remove the comic from the collection */}
      </div>
    );
  }
