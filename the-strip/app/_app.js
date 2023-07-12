import { useClient } from 'react-server-components';


function MyApp({ Component, pageProps }) {
  
  return <Component {...pageProps} />;
}
useClient(); // Mark the root component as a Client Component

export default MyApp;
