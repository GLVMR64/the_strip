import React, { useEffect, useState } from 'react';
import Navbar from '../app/components/Navbar';
import ReactLoading from 'react-loading';
import tailwindConfig from 'tailwind.config';
import axios from 'axios';

export default function Comics() {
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedComics, setExpandedComics] = useState([]);
  const [collection, setCollection] = useState([]);

  useEffect(() => {
    const fetchComics = async () => {
      try {
        const response = await axios.get('http://localhost:5555/comics');
        setComics(response.data);
        console.log(response)
        setLoading(false);
      } catch (error) {
        console.error('Error fetching comics:', error);
        setComics([]);
        setLoading(false);
      }
    };

    fetchComics();
  }, []);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const response = await axios.get('http://localhost:5555/collection'); // Replace with your API endpoint to fetch the user's collection
        setCollection(response.data);
      } catch (error) {
        console.error('Error fetching collection:', error);
        setCollection([]);
      }
    };

    fetchCollection();
  }, []);

  const toggleComicExpansion = (comicId) => {
    setExpandedComics((prevExpandedComics) => {
      if (prevExpandedComics.includes(comicId)) {
        return prevExpandedComics.filter((id) => id !== comicId);
      } else {
        return [...prevExpandedComics, comicId];
      }
    });
  };

  const addToCollection = async (comicId) => {
    try {
      const response = await axios.post('http://localhost:5555/collection', { comicId }); // Replace with your API endpoint to add the comic to the user's collection
      if (response.status === 201) {
        // Comic added successfully, update the collection
        setCollection((prevCollection) => [...prevCollection, response.data]);
      } else {
        console.error('Failed to add comic to collection:', response.status);
      }
    } catch (error) {
      console.error('Failed to add comic to collection:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-wrap items-center justify-center min-h-screen bg-gradient-to-r from-red-500 to-purple-900">
      {loading ? (
  <div className="flex items-center justify-center min-h-screen">
    <ReactLoading type="spin" color="#ffffff" height={80} width={80} />
  </div>
        ) : (
          comics.map((comic) => (
            <div
              key={comic.id}
              className="max-w-sm mx-4 mb-4 bg-white rounded-lg shadow-lg overflow-hidden"
              style={{ backgroundSize: 'cover', backgroundPosition: 'center' }}
              onClick={() => toggleComicExpansion(comic.id)}

            >

              <img src={comic.image}/>
              <div className="p-4">
                <h3 className="text-lg font-semibold">{comic.title}</h3>
                {expandedComics.includes(comic.id) && (
                  <>
                    <p>{comic.description}</p>
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                      onClick={() => addToCollection(comic.id)}
                    >
                      Add to Collection
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
