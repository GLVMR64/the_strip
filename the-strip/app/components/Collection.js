import React, { useContext, useEffect, useState } from "react";
import UserContext from "../components/utils/UserContext";
import ReactLoading from "react-loading";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";

const Collection = () => {
  const buttonStyles = "rounded px-4 py-2 text-white font-semibold";
  const { user } = useContext(UserContext);
  const [collection, setCollection] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [showEditForm, setShowEditForm] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const router = useRouter();

  const fetchCollection = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5555/collection/${user.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch collection");
      }
      const data = await response.json();
      console.log("API Response:", data);
      setCollection(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching collection:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollection();
  }, []);

  const handleEditName = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`http://127.0.0.1:5555/collection/${user.id}/edit-name`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newName }),
      });

      if (response.ok) {
        toast.success("Account updated successfully.");
        setShowEditForm(false);
      } else {
        throw new Error("Failed to update user name");
      }
    } catch (error) {
      console.error("Error updating user name:", error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5555/user/${user.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/register");
        toast.success("Account deleted successfully.");
      } else {
        throw new Error("Failed to delete account");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  const removeFromCollection = async (comicId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5555/collection/${user.id}/${comicId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCollection((prevCollection) => prevCollection.filter((comic) => comic.id !== comicId));
        toast.success("Comic removed from collection successfully.");
      } else {
        throw new Error("Failed to remove comic from collection");
      }
    } catch (error) {
      console.error("Error removing comic from collection:", error);
    }
  };

  const handleAddReview = async (comicId, reviewText) => {
    try {
      const response = await fetch(`http://127.0.0.1:5555/comics/${comicId}/add-review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ review: reviewText }),
      });
  
      if (response.ok) {
        toast.success("Review added successfully.");
        setShowReviewForm(false);
        setReviewText("");
        setSelectedRating(0);
      } else {
        throw new Error("Failed to add review");
      }
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };
  

  return (
    <>
      <div>
        <div className="flex justify-between mb-4">
          <button
            className={`${buttonStyles} bg-gradient-to-r from-red-500 to-pink-500`}
            onClick={handleDeleteAccount}
          >
            Delete Account
          </button>
          <button
            className={`${buttonStyles} bg-gradient-to-r from-blue-500 to-purple-500`}
            onClick={() => setShowEditForm((prev) => !prev)}
          >
            {showEditForm ? "Hide Edit Name" : "Edit Name"}
          </button>
        </div>

        {showEditForm && (
          <form onSubmit={handleEditName} className="mb-4">
            <div className="flex items-center mb-4">
              <label htmlFor="newName" className="mr-2">
                New Name:
              </label>
              <input
                type="text"
                id="newName"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-black"
              />
              <button
                type="submit"
                className={`${buttonStyles} bg-gradient-to-r from-green-500 to-teal-500 ml-2`}
              >
                Update Name
              </button>
            </div>
          </form>
        )}

        <div className="flex flex-wrap justify-center min-h-screen bg-gradient-to-r from-red-500 to-purple-900 p-4">
          <p className="text-white mb-4">Hey {user.name}</p>

          {loading ? (
            <div className="flex items-center justify-center min-h-screen">
              <ReactLoading type="spin" color="#ffffff" height={80} width={80} />
            </div>
          ) : collection.length > 0 ? (
            collection.map((comic) => (
              <div key={comic.id} className="max-w-sm m-4 cursor-pointer">
                <img
                  src={comic.image}
                  alt={comic.title}
                  className="w-full h-48 object-cover"
                />

                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{comic.title}</h3>
                  <p>{comic.description}</p>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded mt-4"
                    onClick={() => removeFromCollection(comic.id)}
                  >
                    Remove from Collection
                  </button>

                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                    onClick={() => setShowReviewForm(true)}
                  >
                    Write a Review
                  </button>

                  {showReviewForm && (
                    <div className="mt-4">
                      <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded resize-none"
                        placeholder="Write your review here"
                      />
                      <div className="mt-2">
                        <p className="text-sm mb-1">Rating:</p>
                        <div className="flex items-center">
                          {Array.from({ length: 5 }, (_, i) => (
                            <button
                              key={i}
                              onClick={() => setSelectedRating(i + 1)}
                              className={`text-xl ${
                                i < selectedRating ? "text-yellow-400" : "text-gray-400"
                              } focus:outline-none`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      </div>
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                        onClick={() => handleAddReview(comic.id)}
                      >
                        Submit Review
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-white">No comics in the collection.</p>
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Collection;
