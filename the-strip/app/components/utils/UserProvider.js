import { useState, useEffect } from "react";
import { UserContext } from './UserContext';

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({}); // Initialize user as an empty object

  const updateUserContext = (newUser) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...newUser,
    }));
  };

  const logIn = (id) => {
    updateUserContext({ loggedIn: true, id: id });
    localStorage.setItem("userToken", id);
  };

  const logOut = () => {
    updateUserContext({ loggedIn: false, id: null });
    localStorage.removeItem("userToken");
  };

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      logIn(userToken);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, logIn, logOut, updateUserContext }}>
      {children}
    </UserContext.Provider>
  );
};
