import React, { useContext } from "react";
import Link from "next/link";
import UserContext from "../components/utils/UserContext";
import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();
  const { logOut, user } = useContext(UserContext);

  const handleLogout = async () => {
    logOut({
      loggedIn: false,
    });
    console.log(user);
    await router.push("/login");
    window.location.reload();
  };

  // Check if the user object exists before accessing its 'id' property
  const userId = user?.id;

  return (
    <nav
      className="py-6 sticky top-0 z-10 bg-gray-900"
      style={{
        backgroundImage: "url(/marvel.jpg)", // Make sure the path is correct based on your public folder structure
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <ul className="flex items-center justify-between max-w-7xl mx-auto px-4">
        {userId && (
          <>
            <li className="nav-item">
              <Link href="/">
                <span className="text-white text-2xl font-bold cursor-pointer hover:text-white hover:bg-red-500 hover:bg-opacity-100 px-4 py-2 rounded">
                  Home
                </span>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/comics">
                <span className="text-white text-2xl font-bold cursor-pointer hover:text-white hover:bg-red-500 hover:bg-opacity-100 px-4 py-2 rounded">
                  Comics
                </span>
              </Link>
            </li>
            <li className="nav-item">
              <Link href={`/collection/${userId}`}>
                <span className="text-white text-2xl font-bold cursor-pointer hover:text-white hover:bg-red-500 hover:bg-opacity-100 px-4 py-2 rounded">
                  My Collection
                </span>
              </Link>
            </li>
            <li className="nav-item">
              <button
                className="text-white text-2xl font-bold hover:text-white hover:bg-red-500 hover:bg-opacity-100 px-4 py-2 rounded"
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
          </>
        )}
        {!userId && (
          <li className="nav-item">
            <Link href="/login">
              <span className="text-white text-2xl font-bold cursor-pointer hover:text-white hover:bg-red-500 hover:bg-opacity-100 px-4 py-2 rounded">
                Login
              </span>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
