import React from 'react';
import { useRouter } from 'next/router';

export default function Collection() {
  const router = useRouter();
  const { id } = router.query;

  // Fetch user's collection data based on the ID

  return (
    <div>
      <h1>Collection</h1>
      <p>User ID: {id}</p>
      {/* Render the user's collection */}
    </div>
  );
}
