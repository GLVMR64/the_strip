import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Navbar from '@/components/Navbar';
import { ToastContainer, toast } from 'react-toastify';

const ComicDetails = () => {
  const router = useRouter();
  const { comic_id, userId, cookieValue } = router.query;

  const [comic, setComic] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComic = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5555/comics/${comic_id}`);
        if (response.ok) {
          const data = await response.json();
          setComic(data);
        } else {
          console.error('Error fetching comic:', response);
        }
      } catch (error) {
        console.error('Error fetching comic:', error);
      } finally {
        setLoading(false);
      }
    };

    if (comic_id) {
      fetchComic();
    }
  }, [comic_id]);


  const handleAddToCollection = async () => {
    if (!userId) {
      console.error('User ID is not available.');
      return;
    }

    const addToCollectionURL = `http://127.0.0.1:5555/collection/${userId}`;
    const comicData = { comic_id: comic_id };

    try {
      const response = await fetch(addToCollectionURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(comicData),
        credentials: 'include', // Include credentials for sending cookies
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
        // Handle success (e.g., show a success message to the user)
      } else {
        console.error('Error adding comic to collection:', response);
        // Handle error (e.g., show an error message to the user)
      }
    } catch (error) {
      console.error('Error adding comic to collection:', error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-red-500 to-purple-900">
      <Navbar/>
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-500 p-8 rounded-lg shadow-md w-96">
          {loading ? (
            <p className="text-white text-center">Loading...</p>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-white mb-4">{comic.title}</h1>
              <img src={comic.image} alt={comic.title} className="w-full h-40 object-cover rounded-lg mb-4" />
              <p className="text-gray-300 mb-4">Release Date: {comic.release_date}</p>
              <p className="text-gray-300 mb-4">{comic.comic_description}</p>
              <button
                onClick={handleAddToCollection}
                className="block w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add to Collection
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComicDetails;
