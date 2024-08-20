import supabase from '../supabaseClient'; // Import Supabase client

const JAMENDO_API_URL = 'https://api.jamendo.com/v3.0';
const JAMENDO_PRIMARY_CLIENT_ID = 'c36a1722';
const JAMENDO_BACKUP_CLIENT_ID = '7328d6ff'; // Replace with your backup client ID

const makeJamendoApiCall = async (endpoint, params = {}) => {
  const paramsString = new URLSearchParams(params).toString();

  // Try with the primary client ID first
  let response = await fetch(`${JAMENDO_API_URL}${endpoint}?client_id=${JAMENDO_PRIMARY_CLIENT_ID}&${paramsString}`);
  if (!response.ok) {
    console.warn('Primary client ID failed, trying with backup client ID');
    // If the primary client ID fails, try with the backup client ID
    response = await fetch(`${JAMENDO_API_URL}${endpoint}?client_id=${JAMENDO_BACKUP_CLIENT_ID}&${paramsString}`);
  }

  if (!response.ok) {
    throw new Error('Network response was not ok with both client IDs');
  }

  return response.json();
};

// Function to fetch backup songs
// const fetchBackupSongs = async () => {
//   const { data, error } = await supabase
//     .from('backup_songs')
//     .select('*');

//   if (error) {
//     console.error('Error fetching backup songs from Supabase:', error);
//     throw error;
//   }
  
//   return data;
// };

// Update your API call functions to use the helper function
export const fetchSongs = async () => {
  try {
    const data = await makeJamendoApiCall('/tracks', {
      format: 'json',
      limit: 10,
      include: 'musicinfo'
    });
    return data.results;
  } catch (error) {
    console.error('Error fetching songs from Jamendo API:', error);
    return fetchBackupSongs();
  }
};

export const fetchTopArtists = async () => {
  try {
    const data = await makeJamendoApiCall('/artists', {
      format: 'json',
      limit: 10,
      order: 'popularity_total'
    });
    console.log('Fetched Top Artists:', data.results); // Assuming `data` contains an `artists` array
    return data.results; // Return the artists data
  } catch (error) {
    console.error('Error fetching Top Artists:', error);
    throw error;
  }
};

// Repeat the same approach for other functions as needed
export const fetchTopAlbums = async () => {
  try {
    const data = await makeJamendoApiCall('/albums', {
      format: 'json',
      limit: 10,
      order: 'popularity_total'
    });
    return data.results;
  } catch (error) {
    console.error('Error fetching top albums:', error);
    throw error;
  }
};

export const fetchTopArtistsWithImages = async () => {
  try {
    const data = await makeJamendoApiCall('/artists', {
      format: 'json',
      limit: 10,
      order: 'popularity_total',
      hasimage: 'true'
    });
    return data.results;
  } catch (error) {
    console.error('Error fetching top artists with images:', error);
    throw error;
  }
};

// Add similar modifications for other API functions as needed

export const signup = async (name, email, password) => {
  // Insert user data into the 'users' table
  const { data, error } = await supabase
    .from('users')
    .insert([{ name, email, password }])
    .single();

  if (error) {
    console.error('Error during signup:', error);
    throw error;
  }

  return data;
};

export const login = async (email, password) => {
  // Check if the user exists with the provided email and password
  const { data, error } = await supabase
    .from('users')
    .select('user_id')
    .eq('email', email)
    .eq('password', password)
    .single();

  if (error || !data) {
    console.error('Error during login or invalid credentials:', error);
    throw error || new Error('Invalid login credentials');
  }

  return data;
};

export const likeSong = async (userId, songId) => {
  try {
    const { data, error } = await supabase
      .from('liked_songs')
      .insert([
        { user_id: userId, song_id: songId, liked_at: new Date() },
      ]);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error liking song:', error);
    throw error;
  }
};

export const fetchLikedSongs = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('liked_songs')
      .select('song_id')
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    const songIds = data.map((item) => item.song_id);

    // Fetch detailed song information based on song_id
    const songs = await Promise.all(
      songIds.map(async (songId) => {
        const response = await makeJamendoApiCall('/tracks', { id: songId });
        return response.results[0]; // Assuming the results array contains the song details
      })
    );

    return songs;
  } catch (error) {
    console.error('Error fetching liked songs:', error);
    throw error;
  }
};

export const dislikeSong = async (userId, songId) => {
  const { data, error } = await supabase
    .from('liked_songs')
    .delete()
    .eq('user_id', userId)
    .eq('song_id', songId);

  if (error) {
    throw error;
  }

  return data;
};

export const fetchBackupSongs = async (userId) => {
  const { data, error } = await supabase
    .from('backup_songs')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    throw error;
  }
  return data;
};

export const addBackupSong = async (userId, song) => {
  const { data, error } = await supabase
    .from('backup_songs')
    .insert([{ user_id: userId, song_id: song.id, song_data: song }]);

  if (error) {
    throw error;
  }
  return data;
};

export const removeBackupSong = async (userId, songId) => {
  const { data, error } = await supabase
    .from('backup_songs')
    .delete()
    .eq('user_id', userId)
    .eq('backup_songs_id', songId);

  if (error) {
    throw error;
  }
  return data;
};

export const fetchPlaylists = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/playlists/${userId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching playlists:', error);
    throw error;
  }
};

export const fetchHotHits = async () => {
  try {
    const data = await makeJamendoApiCall('/tracks', {
      format: 'json',
      limit: 30,
      order: 'popularity_total'
    });
    const tracks = data.results;
    const shuffledTracks = tracks.sort(() => 0.5 - Math.random());
    const randomTracks = shuffledTracks.slice(0, 10);
    return randomTracks;
  } catch (error) {
    console.error('Error fetching hot hits:', error);
    throw error;
  }
};

export const fetchPodcasts = async () => {
  try {
    const data = await makeJamendoApiCall('/podcasts', {
      format: 'json',
      limit: 5,
      order: 'popularity_total'
    });
    return data.results;
  } catch (error) {
    console.error('Error fetching podcasts:', error);
    throw error;
  }
};

export const fetchTrackDetails = async (query) => {
  try {
    const data = await makeJamendoApiCall('/tracks', {
      format: 'json',
      namesearch: query,
      limit: 10
    });
    return data.results;
  } catch (error) {
    console.error('Error fetching track details:', error);
    return [];
  }
};

export const searchMusic = async (query) => {
  try {
    const data = await makeJamendoApiCall('/autocomplete', {
      format: 'json',
      limit: 10,
      prefix: query.toLowerCase(),
      entity: 'tracks',
      matchcount: 'true'
    });
    return data.results;
  } catch (error) {
    console.error('Error searching music:', error);
    return [];
  }
};

export const fetchHotHitsSongs = async () => {
  try {
    console.log('Fetching Hot Hits from Supabase...');
    const { data, error } = await supabase
      .from('Songs')
      .select('*');
      
    if (error) {
      throw error;
    }

    console.log('Supabase response:', data);
    return data;
  } catch (error) {
    console.error('Error fetching Hot Hits:', error);
    return [];
  }
};
