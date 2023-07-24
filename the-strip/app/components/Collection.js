import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Collection = ({ userId }) => {
  const [collection, setCollection] = useState([]);
  

  const fetchCollection = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5555/collection/${userId}`);
      console.log('API Response:', response.data);
      setCollection(response.data); // Check if the response.data is an array
    } catch (error) {
      console.error('Error fetching collection:', error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`http://127.0.0.1:5555/user/${userId}`);
  
      alert('Account deleted successfully.');
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  useEffect(() => {
    fetchCollection();
  }, []);

  return (
    <div>
      {/* Display user's comics if there are any */}
      {collection.length > 0 ? (
        collection.map((comic) => (
          <div key={comic.id}>
            <h3>{comic.title}</h3>
            <p>{comic.description}</p>
          </div>
        ))
      ) : (
        <p>No comics found in the collection.</p>
      )}
  
      {/* Option to delete the user's account */}
      <button onClick={handleDeleteAccount}>Delete Account</button>
    </div>
  );
};

export default Collection;
