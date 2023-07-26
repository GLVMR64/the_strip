import { createContext, useState } from "react";

const UserContext = createContext({
  user: null,
  loggedIn: false,
  logIn: () => {},
  logOut: () => {},
});

export default UserContext;
