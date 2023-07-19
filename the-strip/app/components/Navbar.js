import React, { useContext } from "react";
import Link from "next/link";
import UserContext from "../components/utils/UserContext";
import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();
  const { logOut, user } = useContext(UserContext);

  const handleLogout = () => {
    // Perform any necessary logout logic (e.g., clear session, remove tokens, etc.)
    logOut({
      loggedIn: false,
    });
    console.log(user);

    // Redirect the user to the login page
    router.push("/login");
  };

  return (
    <nav className="bg-black py-4">
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
        <li>
          <Link href={`/collection`}>
            <span className="text-white text-xl font-bold cursor-pointer">
              My Collection
            </span>
          </Link>
        </li>
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
