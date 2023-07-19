import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { UserContext, UserProvider } from "../app/components/utils/UserProvider";
import '../app/styles.css'; // Import the global CSS file

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { setUser } = useContext(UserContext) || {}; // Provide a default empty object

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user data from the database
        const response = await fetch("http://localhost:5555/comics");

        if (response.ok) {
          const data = await response.json();
          setUser(data); // Set the user data in the user context using setUser
        } else {
          console.error("Failed to fetch user data:", response.status);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [router, setUser]);

  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default MyApp;
