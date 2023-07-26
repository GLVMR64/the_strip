import { UserProvider } from "../app/components/utils/UserProvider";
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
