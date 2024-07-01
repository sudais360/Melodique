import axios from 'axios';
import { API_BASE_URL } from '../config';

const JAMENDO_API_URL = 'https://api.jamendo.com/v3.0';
const JAMENDO_CLIENT_ID = 'c36a1722';

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
  try {
    const response = await axios.get(`${JAMENDO_API_URL}/tracks`, {
      params: {
        client_id: JAMENDO_CLIENT_ID,
        format: 'json',
        limit: 30, // Fetch a larger set of tracks
        order: 'popularity_total',
      },
    });
    const tracks = response.data.results;
    // Shuffle the tracks array to randomize the order
    const shuffledTracks = tracks.sort(() => 0.5 - Math.random());
    // Select the first 10 tracks from the shuffled array
    const randomTracks = shuffledTracks.slice(0, 10);
    return randomTracks;
  } catch (error) {
    console.error('Error fetching hot hits:', error);
    throw error;
  }
};
export const fetchTopAlbums = async () => {
  try {
    const response = await axios.get(`${JAMENDO_API_URL}/albums`, {
      params: {
        client_id: JAMENDO_CLIENT_ID,
        format: 'json',
        limit: 10,
        order: 'popularity_total',
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching top albums:', error);
    throw error;
  }
};

export const fetchTopArtistsWithImages = async () => {
  try {
    const response = await axios.get(`${JAMENDO_API_URL}/artists`, {
      params: {
        client_id: JAMENDO_CLIENT_ID,
        format: 'json',
        limit: 10,
        order: 'popularity_total',
        hasimage: true,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching top artists with images:', error);
    throw error;
  }
};

export const fetchPodcasts = async () => {
  try {
    const response = await axios.get(`${JAMENDO_API_URL}/podcasts`, {
      params: {
        client_id: JAMENDO_CLIENT_ID,
        format: 'json',
        limit: 5,
        order: 'popularity_total',
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching podcasts:', error);
    throw error;
  }
};

export const fetchTrackDetails = async (query) => {
  try {
    const response = await axios.get(`${JAMENDO_API_URL}/tracks`, {
      params: {
        client_id: JAMENDO_CLIENT_ID,
        format: 'json',
        namesearch: query,
        limit: 10,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching track details:', error);
    return [];
  }
};

export const searchMusic = async (query) => {
  try {
    const response = await axios.get(`${JAMENDO_API_URL}/autocomplete`, {
      params: {
        client_id: JAMENDO_CLIENT_ID,
        format: 'json',
        limit: 10,
        prefix: query.toLowerCase(),
        entity: 'tracks',
        matchcount: true,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error searching music:', error);
    return [];
  }
};
