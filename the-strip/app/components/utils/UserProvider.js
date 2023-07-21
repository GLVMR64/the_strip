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

  const logOut = () => {
    updateUserContext({ loggedIn: false, id: null });
  };

  const updateUserName = async (name) => {
    try {
      const response = await fetch(`http://127.0.0.1:5555/collection/${user.id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });
      const data = await response.json();
      // Update the user's name in the local state after successful update
      setUser((prevUser) => ({
        ...prevUser,
        name: data.name,
      }));
    } catch (error) {
      console.error("Failed to update name:", error);
      throw error;
    }
  };

  return (
    <UserContext.Provider value={{ user, logIn, logOut, updateUserName }}>
      {children}
    </UserContext.Provider>
  );
};