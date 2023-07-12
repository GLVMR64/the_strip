import Navbar from '../components/Navbar';
import 'tailwindcss/tailwind.css';

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Navbar />
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
