import React, { useEffect, useState, useContext } from "react";
import UserContext from "../../app/components/utils/UserContext";
import { useRouter } from "next/router";
import Navbar from "../../app/components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for toast
// Move fetchCollectionData outside the component
const fetchCollectionData = async (user_id, setCollectionData) => {
  try {
    const response = await fetch(`http://127.0.0.1:5555/collection/${user_id}`);
    if (response.ok) {
      const data = await response.json();
      setCollectionData(data);
    } else {
      console.error("Failed to fetch collection data:", response.status);
    }
  } catch (error) {
    console.error("Failed to fetch collection data:", error);
  }
};

export default function CollectionsPage() {
  const router = useRouter();
  const { user_id } = router.query;
  const { user, updateUserContext } = useContext(UserContext);
  const [collectionData, setCollectionData] = useState(null);
  const [selectedComicId, setSelectedComicId] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewTexts, setReviewTexts] = useState({});
  const [editName, setEditName] = useState(""); // State to store the input value for editing the name
  const [isEditingName, setIsEditingName] = useState(false); // State to track whether the edit name form is open or closed

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (user_id) {
      fetchCollectionData(user_id, setCollectionData); // Fetch collection data only when user_id is available
    }
  }, [user_id, user, updateUserContext]);

  const handleRemoveClick = async (comicId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5555/collection/${user_id}/${comicId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setCollectionData((prevData) =>
          prevData.filter((comic) => comic.id !== comicId)
        );
      } else {
        console.error("Error removing comic from collection:", response);
      }
    } catch (error) {
      console.error("Error removing comic from collection:", error);
    }
  };
  const handleDeleteUser = async () => {
    try {
      // Send a DELETE request to the server to delete the user account
      const response = await fetch(`http://127.0.0.1:5555/collection/${user_id}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        // Clear user-related cookies
        document.cookie = "user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie =
          "cookie_value=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  
        // Redirect to the register page
        router.push("/register");
  
        // Show a success message to the user
        toast.success("User account deleted successfully!");
  
        // Perform a full page refresh to ensure the user is logged out
      } else {
        console.error("Error deleting user account:", response);
        toast.error("Error deleting user account");
      }
    } catch (error) {
      console.error("Error deleting user account:", error);
      toast.error("Error deleting user account");
    }
  
  };
  const handleAddReview = async (comicId) => {
    try {
      // Retrieve the 'user_id' and 'cookie_value' cookies from the document
      const cookies = document.cookie.split(";").reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split("=");
        acc[key] = value;
        return acc;
      }, {});
      const { user_id, cookie_value } = cookies;

      const response = await fetch(
        `http://127.0.0.1:5555/comics/${comicId}/add-review`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            user_id: user_id,
            cookie_value: cookie_value,
          },
          body: JSON.stringify({ review: reviewTexts }),
          credentials: "same-origin", // Use "same-origin" instead of "include"
        }
      );

      if (response.ok) {
        // Handle successful response
      } else if (response.status === 401) {
        console.error(
          "Unauthorized request: Please check user authentication."
        );
      } else {
        throw new Error("Failed to add review");
      }
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  const handleEditNameClick = () => {
    setIsEditingName(true); // Show the edit name form
    setEditName(user.name); // Set the input value to the current user's name
    setShowReviewForm(false); // Hide the review form, if visible
  };

  const handleEditName = async (newName) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5555/collection/${user_id}/edit-name`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            user_id: user_id,
            cookie_value: user.cookie_value, // Assuming you have a cookie named "cookie_value" that contains the user's authentication token
          },
          body: JSON.stringify({ name: newName }),
          credentials: "same-origin",
        }
      );

      if (response.ok) {
        // Update the user's name in the UserContext and local state
        updateUserContext({ ...user, name: newName });
        setEditName(""); // Clear the editName state after successful update
        setIsEditingName(false); // Hide the edit name form after successful update
        toast.success("User name updated successfully!");
      } else {
        console.error("Error updating user name:", response);
        toast.error("Error updating user name");
      }
    } catch (error) {
      console.error("Error updating user name:", error);
      toast.error("Error updating user name");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-r from-red-500 to-purple-900">
        <div className="max-w-7xl mx-auto py-8 px-4">
      <button
  onClick={handleDeleteUser}
  className="bg-gradient-to-r from-red-500 to-purple-600 text-white px-4 py-2 rounded"
>
  Delete Account
</button>
              <button
                onClick={handleEditNameClick}
                className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-4 py-2 rounded mt-4"
              >
                Edit Name
              </button>
          <h1 className="text-3xl font-bold mb-4 text-white">Collection</h1>
          {isEditingName ? (
            <>
              <div className="mb-4">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="p-2 border border-gray-300 rounded text-black"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditName(editName)}
                    className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded"
                  >
                    Submit
                  </button>
                  <button
                    onClick={() => setIsEditingName(false)}
                    className="bg-gradient-to-r from-red-500 to-purple-600 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="text-white mb-4">Hello {user?.name || "there"}</p>
              {collectionData ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {collectionData.map((comic) => (
                    <div
                      key={comic.id}
                      className="bg-white rounded-lg shadow-lg"
                    >
                      <img
                        src={comic.image}
                        alt={comic.title}
                        className="w-full h-56 object-cover rounded-t-lg"
                      />
                      <div className="p-4">
                        <h2 className="text-xl font-semibold mb-2 text-black">
                          {comic.title}
                        </h2>
                        <p className="text-gray-600">
                          {comic.comic_description}
                        </p>
                      </div>
                      <div className="p-4 flex justify-between">
                        <button
                          onClick={() => handleRemoveClick(comic.id)}
                          className="bg-gradient-to-r from-red-500 to-purple-600 text-white px-4 py-2 rounded"
                        >
                          Remove from Collection
                        </button>
                        <button
                          onClick={() => {
                            setSelectedComicId(comic.id);
                            setShowReviewForm(true);
                          }}
                          className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-4 py-2 rounded"
                        >
                          Write Review
                        </button>
                      </div>
                      {showReviewForm && selectedComicId === comic.id && (
                        <div className="p-4">
                          <textarea
                            value={reviewTexts[comic.id] || ""} // Use review text based on the comic ID
                            onChange={(e) =>
                              setReviewTexts((prevTexts) => ({
                                ...prevTexts,
                                [comic.id]: e.target.value, // Store the review text for the specific comic
                              }))
                            }
                            className="w-full p-2 border border-gray-300 rounded resize-none text-black"
                            placeholder="Write your review here"
                          />
                          <div className="mt-2"></div>
                          <button
                            onClick={() => handleAddReview(comic.id)}
                            className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-4 py-2 rounded"
                          >
                            Submit Review
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white">Loading collection data...</p>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
