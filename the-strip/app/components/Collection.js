import React, { useContext, useEffect, useState } from "react";
import UserContext from "../components/utils/UserContext";
import ReactLoading from "react-loading";
import EditNameForm from "../components/EditNameForm";

const Collection = ({ comics }) => {
  const { user, updateUser } = useContext(UserContext);
  const [collection, setCollection] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditNameForm, setShowEditNameForm] = useState(false);

  useEffect(() => {
    const fetchComics = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5555/collection/${user.id}`);
        const data = await response.json();
        setCollection(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching comics:", error);
        setCollection([]);
        setLoading(false);
      }
    };

    fetchComics();
  }, [user.id, comics]);

  function removeFromCollection(comicId) {
    try {
      fetch(`http://127.0.0.1:5555/collection/${user.id}/${comicId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comicId, id: user.id }),
      }).then((res) => {
        if (res.ok) {
          setCollection((prevCollection) =>
            prevCollection.filter((comic) => comic.id !== comicId)
          );
        }
      });
    } catch (error) {
      console.error("Failed to remove comic from collection:", error);
    }
  }

  const handleEditNameSubmit = async (values, { setSubmitting }) => {
    try {
      // Add your logic here to update the user's name with the new value in the backend
      // For example, you can use an API request to send the new name to the server.
      // After a successful update, you can update the user object with the new name.
      // ...

      // Update the user object with the new name
      updateUser({ ...user, name: values.name });

      setSubmitting(false);
      setShowEditNameForm(false);
    } catch (error) {
      console.error("Failed to update name:", error);
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Comic Collection</h1>
        {!showEditNameForm && (
          <div className="flex items-center">
            <h2 className="text-xl font-semibold mr-4">Hello, {user.name}</h2>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => setShowEditNameForm(true)}
            >
              Edit Name
            </button>
          </div>
        )}
      </div>
      {showEditNameForm && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Edit Name</h2>
          <EditNameForm user={user} onSubmit={handleEditNameSubmit} />
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <ReactLoading type="spin" color="#ffffff" height={80} width={80} />
        </div>
      ) : (
        <div className="flex flex-wrap">
          {collection.map((comic) => (
            <div key={comic.id} className="w-1/4 m-4 cursor-pointer">
              <img
                src={comic.image}
                alt={comic.title}
                className="w-full h-48 object-cover transition-transform"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{comic.title}</h3>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => removeFromCollection(comic.id)}
                >
                  Remove from Collection
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Collection;
