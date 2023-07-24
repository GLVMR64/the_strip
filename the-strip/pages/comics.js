import React, { useEffect, useState, useContext } from "react";
import Navbar from "../app/components/Navbar";
import ReactLoading from "react-loading";
import UserContext from "../app/components/utils/UserContext";
import SearchBar from '../app/components/SearchBar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Comics() {
  const [allComics, setAllComics] = useState([]); // To store all comics fetched from the API
  const [comics, setComics] = useState([]); // To store filtered comics based on the search term
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
  const [expandedComicId, setExpandedComicId] = useState(null);
  const [collection, setCollection] = useState([]); // Add collection state
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchComics = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5555/comics");
        const data = await response.json();
        setAllComics(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching comics:", error);
        setAllComics([]);
        setLoading(false);
      }
    };

    fetchComics();
  }, []);

  useEffect(() => {
    // Filter the comics based on the search term
    const filteredComics = allComics.filter((comic) =>
      comic.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setComics(filteredComics);
  }, [searchTerm, allComics]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const toggleComicExpansion = (comicId) => {
    setExpandedComicId((prevExpandedComicId) =>
      prevExpandedComicId === comicId ? null : comicId
    );
  };

  const addToCollection = async (comicId) => {
    try {
      await fetch(`http://127.0.0.1:5555/collection/${user.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comicId }),
      })
        .then((res) => res.json())
        .then((data) => {
          setCollection(data.collection);
          // Show positive feedback using a toast notification
          toast.success('Comic added to collection!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
          });
        });
    } catch (error) {
      console.error("Failed to add comic to collection:", error);
    }
  };

  return (
    <>
      <Navbar />
      {/* Add the ToastContainer to display toast notifications */}
      <ToastContainer />

      <div className="flex flex-wrap justify-center min-h-screen bg-gradient-to-r from-red-500 to-purple-900 p-4">
        {/* Add the SearchBar component */}
        <SearchBar onSearch={handleSearch} />

        {loading ? (
          <div className="flex items-center justify-center min-h-screen">
            <ReactLoading type="spin" color="#ffffff" height={80} width={80} />
          </div>
        ) : comics.length > 0 ? (
          comics.map((comic) => (
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
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                    onClick={() => addToCollection(comic.id)}
                  >
                    Add to Collection
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No comics found for the search term.</p>
        )}
      </div>
    </>
  );
}
