import React, { useContext, useEffect, useState } from "react";
import UserContext from "../components/utils/UserContext";
import ReactLoading from "react-loading";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router"; // Import useRouter hook

const Collection = () => {
  const buttonStyles = "rounded px-4 py-2 text-white font-semibold";
  const { user } = useContext(UserContext);
  const [collection, setCollection] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedComicId, setExpandedComicId] = useState(null);
  const [newName, setNewName] = useState("");
  const [showEditForm, setShowEditForm] = useState(false); // Add state for controlling edit form visibility

  const router = useRouter(); // Use useRouter hook for Next.js
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
    event.preventDefault(); // Prevent the default form submission behavior

    try {
      const response = await fetch(`http://127.0.0.1:5555/user/${user.id}/edit-name`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newName }),
      });

      if (response.ok) {
        toast.success("Account updated successfully.");
        setShowEditForm(false); // Hide the edit form after successful update
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
        // Redirect to the register page after successful deletion
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
        // Remove the comic from the collection state
        setCollection((prevCollection) => prevCollection.filter((comic) => comic.id !== comicId));
        toast.success("Comic removed from collection successfully.");
      } else {
        throw new Error("Failed to remove comic from collection");
      }
    } catch (error) {
      console.error("Error removing comic from collection:", error);
    }
  };

  const toggleComicExpansion = (comicId) => {
    setExpandedComicId((prevExpandedComicId) =>
      prevExpandedComicId === comicId ? null : comicId
    );
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

        {/* Name Edit Form */}
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
          {/* Display the user's name */}
          <p className="text-white mb-4">Hey {user.name}</p>

          {loading ? (
            <div className="flex items-center justify-center min-h-screen">
              <ReactLoading type="spin" color="#ffffff" height={80} width={80} />
            </div>
          ) : collection.length > 0 ? (
            collection.map((comic) => (
              <div
                key={comic.id}
                className="max-w-sm m-4 cursor-pointer"
                onClick={() => toggleComicExpansion(comic.id)}
              >
                <img
                  src={comic.image}
                  alt={comic.title}
                  className={`w-full h-48 object-cover transition-transform ${
                    expandedComicId === comic.id ? "transform -translate-y-2" : ""
                  }`}
                />

                {expandedComicId === comic.id && (
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{comic.title}</h3>
                    <p>{comic.description}</p>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded mt-4"
                      onClick={() => removeFromCollection(comic.id)}
                    >
                      Remove from Collection
                    </button>
                  </div>
                )}
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
