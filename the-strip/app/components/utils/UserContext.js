import { createContext } from "react";

const UserContext = createContext({
  user: null,
  updateUserContext: () => {},
});

export default UserContext;
