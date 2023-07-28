import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";

import Navbar from "@/components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import UserContext from "../../app/components/utils/UserContext";
import "react-toastify/dist/ReactToastify.css";

const ComicDetails = () => {
  const router = useRouter();
  const { comic_id } = router.query;
  const { user } = useContext(UserContext);
  const [comic, setComic] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = user.id;

  useEffect(() => {
    const fetchComic = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5555/comics/${comic_id}`
        );
        if (response.ok) {
          const data = await response.json();
          setComic(data);
        } else {
          console.error("Error fetching comic:", response);
        }
      } catch (error) {
        console.error("Error fetching comic:", error);
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
    if (!userId || !comic_id) {
      console.error("User ID or Comic ID is not available.");
      console.log(userId, comic_id);
      return;
    }

    const addToCollectionURL = `http://127.0.0.1:5555/collection/${userId}`;
    const comicData = { comic_id: comic_id };

    try {
      // Retrieve the 'user_id' and 'cookie_value' cookies from the document
      const cookies = document.cookie.split(";").reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split("=");
        acc[key] = value;
        return acc;
      }, {});
      const { user_id, cookie_value } = cookies;

      const response = await fetch(addToCollectionURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          user_id: user_id, // Include 'user_id' and 'cookie_value' in headers
          cookie_value: cookie_value,
        },
        body: JSON.stringify(comicData),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.message === "Comic already in collection") {
          toast.warning("Comic is already in collection!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        } else {
          toast.success("Comic added to collection!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      } else {
        console.error("Error adding comic to collection:", response);
        toast.error("Error adding comic to collection", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Error adding comic to collection:", error);
      toast.error("Error adding comic to collection", {
        position: "top-right",
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
                    className="w-full h-60 object-contain rounded-lg mb-4"
                  />
                  <h2 className="text-2xl font-bold mb-4 text-white">
                    {comic.title}
                  </h2>
                  <p className="text-gray-500 mb-2 text-white">
                    Release Year: {comic.release_date}
                  </p>
                  <p className="text-white mb-4">{comic.comic_description}</p>
                  <div className="flex justify-between mt-4">
                    <button
                      type="button"
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                      onClick={() => router.push("/comics")}
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
