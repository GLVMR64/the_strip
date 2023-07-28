import { useState, useEffect } from "react";
import { UserContext } from './UserContext'; // Update the file path accordingly


export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false); // New loggedIn state

  const updateUserContext = (newUser) => {

    setUser((prevUser) => {
      const usr = prevUser ? prevUser : {}
      return {
      ...usr,
      ...newUser,
    }});
  };

  const logIn = (id) => {
    updateUserContext({ loggedIn: true, id: id }); // Update loggedIn to true on login
    localStorage.setItem("userToken", id); // Store the user token in Local Storage
  };

  const logOut = () => {
    updateUserContext({ loggedIn: false, id: null }); // Update loggedIn to false on logout
    localStorage.removeItem("userToken"); // Remove the user token from Local Storage
  };

  // Check if the user is already logged in on initial load
  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      logIn(userToken); // Automatically log in the user if a valid token is found
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, loggedIn, logIn, logOut, updateUserContext }}>
      {children}
    </UserContext.Provider>
  );
};
