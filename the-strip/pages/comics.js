import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import UserContext from '../app/components/utils/UserContext'; // Import the UserContext
import Navbar from '../app/components/Navbar';
import Cookies from 'js-cookie';

const Comics = () => {
  const router = useRouter();
  const [comics, setComics] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Retrieve the user ID and cookie value from the UserContext
  const { user } = useContext(UserContext);
  const userId = user?.id;
  const cookieValue = user?.cookieValue;

  useEffect(() => {
    const fetchComics = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5555/comics');
        if (response.ok) {
          const data = await response.json();
          setComics(data);
        } else {
          console.error('Error fetching comics:', response);
        }
      } catch (error) {
        console.error('Error fetching comics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComics();
  }, []);

  const handleComicClick = (comicId) => {
    router.push({
      pathname: `/comics/${comicId}`,
      query: {
        userId: userId,
        cookieValue: cookieValue,
      },
    });
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredComics = comics.filter((comic) =>
    comic.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-red-500 to-purple-900">
          <div className="max-w-screen-sm">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search Comics..."
              className="w-full p-2 mb-4 border border-gray-300 rounded text-black"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredComics.length === 0 ? (
                <p className="text-black">No comics found.</p>
              ) : (
                filteredComics.map((comic) => (
                  <div
                    key={comic.id}
                    className="p-4 border rounded-lg cursor-pointer hover:shadow-md bg-white"
                    onClick={() => handleComicClick(comic.id)}
                  >
                    <h3 className="mt-2 text-lg font-semibold text-black">{comic.title}</h3>
                    <img src={comic.image} alt={comic.title} className="w-full h-64 object-contain" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Comics;
