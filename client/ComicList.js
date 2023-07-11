import { useEffect, useState } from 'react';
import { fetchComics } from './services/api';

function ComicsList() {
  const [comics, setComics] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchComics();
      if (data) {
        setComics(data);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Comics List</h1>
      <ul>
        {comics.map(comic => (
          <li key={comic.id}>{comic.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default ComicsList;
