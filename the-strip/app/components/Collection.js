import React, { useContext, useEffect, useState } from "react";
import UserContext from "../components/utils/UserContext";
import ReactLoading from "react-loading";

const Collection = ({ comics }) => {
  const { user } = useContext(UserContext);
  const [collection, setCollection] = useState([]);
  const [loading, setLoading] = useState(true); // Set initial loading state to true

  // Update the collection state when the comics prop changes or when the user changes
  useEffect(() => {
    const fetchComics = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5555/collection/${user.id}`);
        const data = await response.json();
        setCollection(data);
        setLoading(false); // Set loading to false after fetching data
      } catch (error) {
        console.error("Error fetching comics:", error);
        setCollection([]); // Set an empty collection if there's an error
        setLoading(false); // Set loading to false in case of an error
      }
    };

    fetchComics();
  }, [user.id, comics]); // Add user.id and comics to the dependency array

  function removeFromCollection(comicId) {
    try {
      // Make a DELETE request to the server to remove the comic from the user's collection
      fetch(`http://127.0.0.1:5555/collection/${user.id}/${comicId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comicId, id: user.id }),
      }).then((res) => {
        // Update the collection state with the new collection data after successful removal
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

  return (
    <div>
      <h1>Comic Collection</h1>
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <ReactLoading type="spin" color="#ffffff" height={80} width={80} />
        </div>
      ) : (
        collection.map((comic) => (
          <div
            key={comic.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h3>{comic.title}</h3>
            <img
              src={comic.image}
              alt={comic.title}
              style={{ maxWidth: "200px" }}
            />
            <button onClick={() => removeFromCollection(comic.id)}>
              Remove from Collection
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Collection;
