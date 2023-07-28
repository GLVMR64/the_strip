import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import Navbar from '@/components/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ComicReviews from '../../app/components/Reviews'; // Import the ComicReviews component

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

    // Call the fetchComic function only when comic_id changes
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
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.message === 'Comic already in collection') {
          toast.warning('Comic is already in collection!', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        } else {
          toast.success('Comic added to collection!', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      } else {
        // Handle non-200 response status (error)
        console.error('Error adding comic to collection:', response);
        toast.error('Comic already in collection!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error('Error adding comic to collection:', error);
      toast.error('Error adding comic to collection', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-r from-red-500 to-purple-900 p-4">
        <div className="max-w-md mx-auto bg-gradient-to-r from-indigo-700 to-indigo-800 p-8 rounded-lg shadow-lg">
          {loading ? (
            <p className="text-center text-white">Loading...</p>
          ) : (
            <>
              {comic ? (
                <>
                  <img
                    src={comic.image}
                    alt={comic.title}
                    className="w-full h-60 object-contain rounded-lg mb-4" // Adjusted styling for the image
                  />
                  <h2 className="text-2xl font-bold mb-4 text-white">{comic.title}</h2>
                  <p className="text-gray-500 mb-2 text-white">Release Year: {comic.release_date}</p>
                  <p className="text-white mb-4">{comic.comic_description}</p>
                  <div className="flex justify-between mt-4">
                    <button
                      type="button"
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                      onClick={() => router.push('/comics')}
                    >
                      Go back to Comics
                    </button>
                    <button
                      type="button"
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                      onClick={handleAddToCollection}
                    >
                      Add to Collection
                    </button>
                  </div>
                  {/* Pass the comicId to the ComicReviews component */}
                  <ComicReviews comicId={comic.id} />
                </>
              ) : (
                <p className="text-white">Comic not found.</p>
              )}
            </>
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
  
};

export default ComicDetails;
