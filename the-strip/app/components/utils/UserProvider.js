import { useState } from "react";
import UserContext from "./UserContext";

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const updateUserContext = (newUser) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...newUser,
    }));
  };

  const logIn = (id) => {
    updateUserContext({ loggedIn: false, id: id });
  };

  const logOut = (id) => {
    updateUserContext({ loggedIn: false, id: id });
  };

  return (
    <UserContext.Provider value={{ user, logIn, logOut }}>
      {children}
    </UserContext.Provider>
  );
};
