import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../app/components/Navbar';
import axios from 'axios';

export default function ComicDetails() {
  const router = useRouter();
  const { comic_id } = router.query;
  const [comic, setComic] = useState(null);
  const [isInCollection, setIsInCollection] = useState(false);

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

  const handleAddToCollection = () => {
    // Implement the logic to add the comic to the collection
    // You can use axios to send a POST request to the server endpoint `/collection` with the comic_id
    axios.post('http://localhost:5555/collection', { comic_id })
      .then(() => {
        setIsInCollection(true);
      })
      .catch((error) => {
        console.error('Error adding comic to collection:', error);
      });
  };

  const handleRemoveFromCollection = () => {
    // Implement the logic to remove the comic from the collection
    // You can use axios to send a DELETE request to the server endpoint `/collection` with the comic_id
    axios.delete(`http://localhost:5555/collection/${comic_id}`)
      .then(() => {
        setIsInCollection(false);
      })
      .catch((error) => {
        console.error('Error removing comic from collection:', error);
      });
  };

  if (!comic) {
    return <p>Loading comic details...</p>;
  }

  return (
    <div>
      <h1>{comic.title}</h1>
      <img src={comic.image_url} alt={comic.title} />
      <p>{comic.description}</p>
      {isInCollection ? (
        <button onClick={handleRemoveFromCollection}>Remove from Collection</button>
      ) : (
        <button onClick={handleAddToCollection}>Add to Collection</button>
      )}
    </div>
  );
}

  