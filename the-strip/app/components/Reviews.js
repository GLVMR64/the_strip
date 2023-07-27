import React, { useEffect, useState } from 'react';

const ComicReviews = ({ comicId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5555/comics/${comicId}/reviews`);
        if (!response.ok) {
          throw new Error('Error fetching reviews.');
        }
        const data = await response.json();
        setReviews(data); // Assuming the response returns an array of reviews
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [comicId]);

  return (
    <div>
      <h2>Reviews</h2>
      <ul>
        {reviews.map((review) => (
          <li key={review.id}>
            <p>{review.review_text}</p>
            {/* Display any other review information here */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ComicReviews;
