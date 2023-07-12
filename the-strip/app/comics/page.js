import React, { useEffect, useState } from 'react';
useClient();

export default function Comics() {
  const [comics, setComics] = React.useState([]);

  React.useEffect(() => {
    async function fetchComics() {
      try {
        const response = await fetch('http://localhost:5555/comics');
        const data = await response.json();
        setComics(data);
      } catch (error) {
        console.error('Error fetching comics:', error);
        setComics([]);
      }
    }

    fetchComics();
  }, []);

  return (
    <div>
      <h1>Comics</h1>
      {comics.map((comic) => (
        <div key={comic.id}>
          <h2>{comic.title}</h2>
          <p>{comic.description}</p>
        </div>
      ))}
    </div>
  );
}
