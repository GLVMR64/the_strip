import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { UserProvider } from "../app/components/utils/UserProvider";
import UserContext from '../app/components/utils/UserContext'
import "../app/globals.css"
import '../app/tailwind.css';

function MyApp({ Component, pageProps }) {
  // const router = useRouter();
  // const { updateUserContext, user } = useContext(UserContext);

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       // Fetch user data from the database
  //       const response = await fetch("http://localhost:5555/user");

  //       if (response.ok) {
  //         const data = await response.json();
  //         console.log(data)
  //         updateUserContext(data); // Set the user data in the user context using setUser
  //       } else {
  //         console.error("Failed to fetch user data:", response.status);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching user data:", error);
  //     }
  //   };

  //   fetchUserData();
  // }, [router, updateUserContext]);

  return (
    <UserProvider>
      <UserContext.Consumer>
        {(userContext) => (
          <Component {...pageProps} userContext={userContext} />
        )}
      </UserContext.Consumer>
    </UserProvider>
  );
}

export default MyApp;
