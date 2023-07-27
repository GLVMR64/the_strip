import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Navbar from '@/components/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        if (data.message === 'Comic already in collection') {
          toast.warning('Comic is already in collection!', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          // Call removeFromCollection if comic is already in collection
          removeFromCollection(comic_id);
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
        toast.error('Error adding comic to collection', {
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

  const removeFromCollection = async (comicId) => {
    if (!userId) {
      console.error('User ID is not available.');
      return;
    }

    const removeFromCollectionURL = `http://127.0.0.1:5555/collection/${userId}/${comicId}`;

    try {
      const response = await fetch(removeFromCollectionURL, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        toast.success('Comic removed from collection!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        // Handle non-200 response status (error)
        console.error('Error removing comic from collection:', response);
        toast.error('Error removing comic from collection', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error('Error removing comic from collection:', error);
      toast.error('Error removing comic from collection', {
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
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-4">{comic.title}</h2>
              <p>{comic.description}</p>
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => router.push(`/comics/${comic_id}`)}
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
            </>
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default ComicDetails;
