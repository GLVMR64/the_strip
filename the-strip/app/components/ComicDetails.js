import React, { useState } from 'react';
import { Transition } from 'react-transition-group';
import axios from 'axios';

export default function ComicDetails({ comic, onClose }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAddToCollection = () => {
    const addToCollectionURL = `/comics/${comic.id}/add-to-collection`;
    axios.post(addToCollectionURL)
      .then(response => {
        console.log(response.data.message);
        // Handle success
      })
      .catch(error => {
        console.error('Error adding comic to collection:', error);
        // Handle error
      });
  };

  const handleWriteReview = () => {
    const writeReviewURL = `/comics/${comic.id}/write-review`;
    const reviewData = { rating, comment };
    axios.post(writeReviewURL, reviewData)
      .then(response => {
        console.log(response.data.message);
        // Handle success
      })
      .catch(error => {
        console.error('Error writing review:', error);
        // Handle error
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

          <div className="mt-4">
            <label htmlFor="rating" className="block mb-2 font-medium">
              Rating
            </label>
            <input
              type="number"
              id="rating"
              name="rating"
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mt-4">
            <label htmlFor="comment" className="block mb-2 font-medium">
              Comment
            </label>
            <textarea
              id="comment"
              name="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            ></textarea>
          </div>

          <div className="flex justify-between mt-4">
            <button type="button" className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleAddToCollection}>
              Add to Collection
            </button>

            <button type="button" className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleWriteReview}>
              Write Review
            </button>
          </div>

          <button
            type="button"
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded mt-4"
            onClick={handleToggleExpand}
          >
            Close
          </button>
        </div>
      )}
    </Transition>
  );
}
