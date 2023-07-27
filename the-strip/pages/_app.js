// pages/_app.js
import { UserProvider } from "../app/components/utils/UserProvider"; // Update the file path accordingly
import "../app/globals.css";
import "../app/tailwind.css";

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default MyApp;
