import React, { useState } from 'react';
import { Transition } from 'react-transition-group';
import axios from 'axios';

export default function ComicDetails({ comic, onClose }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAddToCollection = () => {
    const addToCollectionURL = 'http://127.0.0.1:5555/collection';
    const comicData = { comic_id: comic.id };
    axios
      .post(addToCollectionURL, comicData)
      .then(response => {
        console.log(response.data.message);
        // Handle success (e.g., show a success message to the user)
      })
      .catch(error => {
        console.error('Error adding comic to collection:', error);
        // Handle error (e.g., show an error message to the user)
      });
  };

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Transition in={isExpanded} timeout={200} mountOnEnter unmountOnExit>
      {(state) => (
        <div className={`bg-white p-8 rounded-lg shadow-lg transition-opacity duration-200 ${state}`}>
          <h2 className="text-2xl font-bold mb-4">{comic.title}</h2>
          <p>{comic.description}</p>

          <div className="flex justify-between mt-4">
            <button type="button" className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleAddToCollection}>
              Add to Collection
            </button>

            <button
              type="button"
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
              onClick={handleToggleExpand}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Transition>
  );
}
