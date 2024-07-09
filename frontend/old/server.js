require('dotenv').config(); // Load environment variables from .env file
const express = require('express'); // Import the Express.js framework
const axios = require('axios'); // Import Axios for making HTTP requests
const admin = require('firebase-admin'); // Import Firebase Admin SDK
const cors = require('cors'); // Import CORS to handle cross-origin requests

const youtubeService = require('./youtubeService.js'); // Import YouTube service module

// Initialize Firebase Admin SDK with credentials from environment variables
admin.initializeApp({
  credential: admin.credential.cert(require(process.env.GOOGLE_APPLICATION_CREDENTIALS)),
  projectId: process.env.FIREBASE_PROJECT_ID,
});

const db = admin.firestore(); // Initialize Firestore database
const app = express(); // Create an Express application
const port = 3001; // Set the port for the server

const isDeveloperMode = process.env.DEVELOPER_MODE === 'true'; // Check if developer mode is enabled

const API_KEY = process.env.API_KEY; // YouTube API key
let liveChatId = ''; // Variable to store the live chat ID
let curVideoId = ''; // Variable to store the current video ID

app.use(cors()); // Enable CORS
app.use(express.json()); // Enable JSON body parsing

// Route to initiate OAuth2 authorization
app.get('/authorize', (request, response) => {
  console.log('/auth');
  youtubeService.getCode(response);
});

// OAuth2 callback route to handle the authorization code
app.get('/oauth2callback', async (req, res) => {
  const { code } = req.query;
  try {
    await youtubeService.getTokensWithCode(code);
    res.redirect('http://localhost:3000'); // Redirect back to the frontend application
  } catch (error) {
    console.error('Error during OAuth2 callback:', error);
    res.status(500).send('Error during OAuth2 callback');
  }
});

// Route to insert a message into the live chat
app.post('/insert-message', async (req, res) => {
  const message = req.body.message;
  try {
    await getLiveChatId(curVideoId); // Get the live chat ID for the current video
    console.log('liveChatId:', liveChatId);
    youtubeService.insertMessage(message, liveChatId); // Insert the message into the live chat
    console.log('inserted message');
    res.redirect('/');
  } catch (error) {
    console.error('Error inserting message:', error);
    res.status(500).send('Error inserting message');
  }
});

// Function to fetch the live chat ID for a given video ID
const getLiveChatId = async (videoId) => {
  if (isDeveloperMode) {
    console.log(`Developer Mode: Fetching live chat ID for video ID: ${videoId}`);
    liveChatId = 'DEMO_CHAT_ID';
    return;
  }

  console.log(`Fetching live chat ID for video ID: ${videoId}`);
  try {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${videoId}&key=${API_KEY}`;
    console.log(`Request URL: ${url}`);
    const response = await axios.get(url);
    console.log(`Response data: ${JSON.stringify(response.data, null, 2)}`);

    if (response.data.items.length > 0 && response.data.items[0].liveStreamingDetails) {
      liveChatId = response.data.items[0].liveStreamingDetails.activeLiveChatId;
      console.log('Live Chat ID:', liveChatId);
    } else {
      console.log('No live chat found for the video ID:', videoId);
      liveChatId = ''; // Reset liveChatId if no live chat is found
    }
  } catch (error) {
    console.error('Error retrieving live chat ID:', error.response ? error.response.data : error.message);
    liveChatId = ''; // Reset liveChatId in case of error
  }
};

// Route to set the current video ID and fetch the live chat ID
app.post('/setVideoId', async (req, res) => {
  const { videoId } = req.body;
  curVideoId = videoId;
  console.log(`Received request to set video ID: ${videoId}`);

  try {
    await getLiveChatId(videoId); // Fetch the live chat ID for the new video ID
    if (liveChatId) {
      res.status(200).send({ liveChatId });
    } else {
      res.status(404).send('No live chat found for the provided video ID');
    }
  } catch (error) {
    console.error('Error setting live chat ID:', error);
    res.status(500).send('Error setting Live Chat ID');
  }
});

// Route to fetch chat messages from the live chat
app.get('/fetchChatMessages', async (req, res) => {
  if (!liveChatId) {
    return res.status(500).send('Live Chat ID not available');
  }

  try {
    const messages = await youtubeService.fetchChatMessages(liveChatId); // Fetch chat messages
    res.status(200).send(messages);
  } catch (error) {
    console.error('Error fetching chat messages:', error.response ? error.response.data : error.message);
    res.status(500).send(error);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
