import { createContext } from "react";

const UserContext = createContext({
  user: null,
  updateUserContext: () => {}, // Add a default empty function
});

export default UserContext;
