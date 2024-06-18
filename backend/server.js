const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const qs = require('querystring');

const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());

const CLIENT_ID = '222c517296214ce783e3dfa32c9affaa';
const CLIENT_SECRET = '963c08668bc440b2b14538a3e7a0a649';
let accessToken = '';

const getSpotifyAccessToken = async () => {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')
    },
    body: qs.stringify({
      grant_type: 'client_credentials'
    })
  });

  const data = await response.json();
  accessToken = data.access_token;
};



// Fetch Spotify playlist tracks
const fetchPlaylistTracks = async (playlistId) => {
  const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  const data = await response.json();
  return data.items.map(item => item.track.artists[0]); // Extract the first artist from each track
};

// Fetch Spotify artist data
const fetchArtistData = async (artistId) => {
  const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  const data = await response.json();
  return {
    name: data.name,
    photo: data.images[0]?.url || 'https://via.placeholder.com/300x300.png?text=No+Image',
    description: `Genres: ${data.genres.join(', ')}`,
    socialMediaLinks: [
      { platform: 'Spotify', url: data.external_urls.spotify }
    ],
    newMusic: [], // Add top tracks or new releases if needed
    members: data.genres // Placeholder
  };
};

app.get('/api/artists', async (req, res) => {
  const playlistId = '37i9dQZF1DX9tPFwDMOaN1'; 
  try {
    await getSpotifyAccessToken();
    const playlistTracks = await fetchPlaylistTracks(playlistId);
    const uniqueArtists = [...new Map(playlistTracks.map(artist => [artist.id, artist])).values()]; // Remove duplicate artists
    const topArtists = uniqueArtists.slice(0, 50); // Get the top 100 artists

    const artists = await Promise.all(topArtists.map(artist => fetchArtistData(artist.id)));
    console.log('Fetched artists:', artists); // Debug log
    res.json(artists);
  } catch (error) {
    console.error('Error fetching artists:', error); // Error log
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
