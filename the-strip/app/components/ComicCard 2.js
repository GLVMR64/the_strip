import React from 'react';

export default function ComicDetails({ comic, onClose }) {
  return (
    <div className="comic-details">
      <h2>{comic.title}</h2>
      <p>{comic.description}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

