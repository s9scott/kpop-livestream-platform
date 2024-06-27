require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const axios = require('axios');
const admin = require('firebase-admin');
const cors = require('cors'); // For handling CORS

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(require(process.env.GOOGLE_APPLICATION_CREDENTIALS)),
  projectId: process.env.FIREBASE_PROJECT_ID,
});

const db = admin.firestore();
const app = express();
const port = 3001;

const API_KEY = 'AIzaSyCJXkbG-hi1ECUlkXJ3yZS_-agRa9bPzCM';
let liveChatId = '';

app.use(cors()); // Enable CORS
app.use(express.json());

const getLiveChatId = async (videoId) => {
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

app.post('/setVideoId', async (req, res) => {
  const { videoId } = req.body;

  console.log(`Received request to set video ID: ${videoId}`);

  try {
    await getLiveChatId(videoId);
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
/*
app.post('/sendMessage', async (req, res) => {
  const { message } = req.body;

  if (!liveChatId) {
    return res.status(500).send('Live Chat ID not available');
  }

  try {
    const response = await axios.post(
      `https://www.googleapis.com/youtube/v3/liveChat/messages?part=snippet`,
      {
        snippet: {
          liveChatId: liveChatId,
          type: 'textMessageEvent',
          textMessageDetails: {
            messageText: message,
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer YOUR_OAUTH_ACCESS_TOKEN`,
          Accept: 'application/json',
        },
      }
    );

    res.status(200).send(response.data);
  } catch (error) {
    console.error('Error sending message:', error.response ? error.response.data : error.message);
    res.status(500).send(error);
  }
});
*/
app.get('/fetchChatMessages', async (req, res) => {
  if (!liveChatId) {
    return res.status(500).send('Live Chat ID not available');
  }

  try {
    const url = `https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=${liveChatId}&part=snippet,authorDetails&key=${API_KEY}`;
    const response = await axios.get(url);
    const { data } = response;

    const messages = data.items.map(item => ({
      text: item.snippet.displayMessage,
      author: item.authorDetails.displayName,
      timestamp: new Date(item.snippet.publishedAt).toLocaleString(),
    }));

    res.status(200).send(messages);
  } catch (error) {
    console.error('Error fetching chat messages:', error.response ? error.response.data : error.message);
    res.status(500).send(error);
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to the K-pop Livestream Platform Backend!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
