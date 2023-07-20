// Import the necessary modules
import React, { useEffect, useState } from 'react';

export default function Collection() {
  const [collection, setCollection] = useState([]);

  // Fetch the user's collection when the component mounts
  useEffect(() => {
    fetch('http://localhost:5555/collection', {
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => setCollection(data))
      .catch((error) => console.error('Error fetching collection:', error));
  }, []);

  return (
    <div>
      <h1>My Collection</h1>
      {collection.map((comic) => (
        <div key={comic.id}>
          <h2>{comic.title}</h2>
          <p>{comic.description}</p>
          <img src={comic.image} alt={comic.title} />
        </div>
      ))}
    </div>
  );
}
