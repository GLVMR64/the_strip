import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null); // You can set it to `null` initially or get it from cookies/local storage

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};
export default UserContext;