const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());

const API_KEY = '1ddb4420305c8c1d81c85d4f53a2b1a8';

// Function to fetch artist data from Last.fm
const fetchArtistData = async (artistName) => {
  const response = await fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${artistName}&api_key=${API_KEY}&format=json`);
  const data = await response.json();
  if (data.error) {
    throw new Error(data.message);
  }
  return {
    name: data.artist.name,
    photo: data.artist.image.find(img => img.size === 'large')['#text'],
    description: data.artist.bio.summary,
    socialMediaLinks: [
      { platform: 'Last.fm', url: data.artist.url }
    ],
    newMusic: [] // Last.fm API doesn't provide recent tracks directly; need additional calls
  };
};

app.get('/api/artists', async (req, res) => {
  const artistNames = ['BTS', 'Blackpink', 'TWICE', 'EXO', 'Red Velvet']; // List of K-pop artists
  try {
    const artists = await Promise.all(artistNames.map(name => fetchArtistData(name)));
    res.json(artists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
