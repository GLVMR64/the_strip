import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5555';  // Replace with your backend server URL

export const fetchComics = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/comics`);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
