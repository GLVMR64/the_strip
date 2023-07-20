import React, { useContext } from "react";
import Link from "next/link";
import UserContext from "../components/utils/UserContext";
import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();
  const { logOut, user } = useContext(UserContext);

  const handleLogout = () => {
    logOut({
      loggedIn: false,
    });
    console.log(user);
    router.push("/login");
  };

  // Check if the user object exists before accessing its 'id' property
  const userId = user?.id;

  return (
    <nav
    className="py-4"
    style={{
      backgroundImage: "url(/marvel.jpg)", // Make sure the path is correct based on your public folder structure
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
    }}
  >
      <ul className="flex items-center justify-between max-w-7xl mx-auto px-4">
        <li>
          <Link href="/">
            <span className="text-white text-xl font-bold cursor-pointer">
              Home
            </span>
          </Link>
        </li>
        <li>
          <Link href="/comics">
            <span className="text-white text-xl font-bold cursor-pointer">
              Comics
            </span>
          </Link>
        </li>
        {/* Use the 'userId' variable to conditionally render the link */}
        {userId && (
          <li>
            <Link href={`/collection/${userId}`}>
              <span className="text-white text-xl font-bold cursor-pointer">
                My Collection
              </span>
            </Link>
          </li>
        )}
        <li>
          <button
            className="text-white text-xl font-bold"
            onClick={handleLogout}
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}
