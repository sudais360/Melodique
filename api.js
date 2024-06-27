// api.js
import axios from 'axios';
import { API_BASE_URL } from './config';

const JAMENDO_API_URL = 'https://api.jamendo.com/v3.0';
const JAMENDO_CLIENT_ID = 'c36a1722';  // Replace with your Jamendo client ID

export const signup = async (name, email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/signup`, { name, email, password });
    return response.data;
  } catch (error) {
    console.error('Error during signup:', error);
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export const fetchPlaylists = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/playlists/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching playlists:', error);
    throw error;
  }
};

export const fetchHotHits = async () => {
  const response = await fetch('https://api.jamendo.com/v3.0/tracks/?client_id=your_client_id&format=jsonpretty&limit=10&order=popularity_total');
  const data = await response.json();
  return data.results;
};

export const fetchTopAlbums = async () => {
  const response = await fetch('https://api.jamendo.com/v3.0/albums/?client_id=your_client_id&format=jsonpretty&limit=10&order=popularity_total');
  const data = await response.json();
  return data.results;
};

export const fetchTopArtistsWithImages = async () => {
  const response = await fetch('https://api.jamendo.com/v3.0/artists/?client_id=your_client_id&format=jsonpretty&limit=10&order=popularity_total&hasimage=true');
  const data = await response.json();
  return data.results;
};


export const fetchPodcasts = async () => {
  try {
    const response = await axios.get(`${JAMENDO_API_URL}/podcasts`, {
      params: {
        client_id: JAMENDO_CLIENT_ID,
        format: 'json',
        limit: 5,
        order: 'popularity_total'
      }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching podcasts:', error);
    throw error;
  }
};
