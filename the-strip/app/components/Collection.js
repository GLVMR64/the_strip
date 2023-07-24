import React, { useState, useEffect, useContext } from 'react';
import UserContext from '../components/utils/UserContext';
import ReactLoading from 'react-loading';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router'; // Import useRouter hook

const Collection = () => {
  
  const { user } = useContext(UserContext);
  const [collection, setCollection] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedComicId, setExpandedComicId] = useState(null);
  const [newName, setNewName] = useState('');

  const router = useRouter(); // Use useRouter hook for Next.js
  const fetchCollection = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5555/collection/${user.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch collection');
      }
      const data = await response.json();
      console.log('API Response:', data);
      setCollection(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching collection:', error);
      setLoading(false);
    }
  };
  
  const handleEditName = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5555/user/${user.id}/edit-name`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName }),
      });
      
      if (response.ok) {
        toast.success('Account updated successfully.');
        
      } else {
        throw new Error('Failed to update user name');
      }
    } catch (error) {
      console.error('Error updating user name:', error);
    }
  };
  
  const handleDeleteAccount = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5555/user/${user.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Account deleted successfully.');
        // Redirect to the register page after successful deletion
        router.push('/register');
      } else {
        throw new Error('Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };


  const toggleComicExpansion = (comicId) => {
    setExpandedComicId((prevExpandedComicId) => (prevExpandedComicId === comicId ? null : comicId));
  };
  
  return (
    <>
      <div>
        <label htmlFor="newName">New Name:</label>
        <input
          type="text"
          id="newName"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button onClick={handleEditName}>Update Name</button>
      </div>

      {/* Option to delete the user's account */}
      <button onClick={handleDeleteAccount}>Delete Account</button>

      <div className="flex flex-wrap justify-center min-h-screen bg-gradient-to-r from-red-500 to-purple-900 p-4">
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
                  expandedComicId === comic.id ? 'transform -translate-y-2' : ''
                }`}
              />

              {expandedComicId === comic.id && (
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{comic.title}</h3>
                  <p>{comic.description}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No comics found in the collection.</p>
        )}
      </div>
    </>
  );
};

export default Collection;
