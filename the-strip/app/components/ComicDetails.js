// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/router';
// import Cookies from 'js-cookie';

// const ComicDetails = () => {
//   const router = useRouter();
//   const { comic_id } = router.query;

//   // Replace 'userId' with the actual ID of the logged-in user
//   const userId = Cookies.get('user_id'); // Retrieve the user ID from the cookie
//   const [comic, setComic] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchComic = async () => {
//       try {
//         const response = await fetch(`http://127.0.0.1:5555/comics/${comic_id}`);
//         if (response.ok) {
//           const data = await response.json();
//           setComic(data);
//         } else {
//           console.error('Error fetching comic:', response);
//         }
//       } catch (error) {
//         console.error('Error fetching comic:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (comic_id) {
//       fetchComic();
//     }
//   }, [comic_id]);

//   const handleAddToCollection = async () => {
//     if (!userId) {
//       console.error('User ID is not available.');
//       return;
//     }

//     const addToCollectionURL = `http://127.0.0.1:5555/collection/${userId}`;
//     const comicData = { comic_id: comic_id };

//     try {
//       const response = await fetch(addToCollectionURL, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(comicData),
//         credentials: 'include', // Include credentials for sending cookies
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log(data.message);
//         // Handle success (e.g., show a success message to the user)
//       } else {
//         console.error('Error adding comic to collection:', response);
//         // Handle error (e.g., show an error message to the user)
//       }
//     } catch (error) {
//       console.error('Error adding comic to collection:', error);
//       // Handle error (e.g., show an error message to the user)
//     }
//   };

//   return (
//     <div className="bg-white p-8 rounded-lg shadow-lg">
//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <>
//           <h2 className="text-2xl font-bold mb-4">{comic.title}</h2>
//           <p>{comic.description}</p>
//           <div className="flex justify-between mt-4">
//             <button
//               type="button"
//               className="bg-blue-500 text-white px-4 py-2 rounded"
//               onClick={() => router.push(`/comics/${comic_id}`)}
//             >
//               Go back to Comics
//             </button>
//             <button
//               type="button"
//               className="bg-blue-500 text-white px-4 py-2 rounded"
//               onClick={handleAddToCollection}
//             >
//               Add to Collection
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default ComicDetails;
