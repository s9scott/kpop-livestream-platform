const { google } = require('googleapis'); // Import Google APIs
const util = require('util'); // Import Node.js utility module
const fs = require('fs'); // Import Node.js file system module
const axios = require('axios'); // Import Axios for making HTTP requests
const { logQuotaUsage } = require('./quotaTracker'); // Import the quota tracker module
require('dotenv').config(); // Load environment variables from .env file

// Check if developer mode is enabled
const isDeveloperMode = process.env.DEVELOPER_MODE === 'true';

// Promisify file system functions
const writeFilePromise = util.promisify(fs.writeFile);
const readFilePromise = util.promisify(fs.readFile);

// Function to save a file to disk
const save = async (path, str) => {
  try {
    await writeFilePromise(path, str);
    console.log('Successfully Saved:', path);
  } catch (error) {
    console.error('Error saving file:', path, error);
  }
};

// Function to read a file from disk
const read = async (path) => {
  try {
    const fileContents = await readFilePromise(path);
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading file:', path, error);
    return null;
  }
};

// Initialize YouTube API
const youtube = google.youtube('v3');
const OAuth2 = google.auth.OAuth2;

const clientId = process.env.REACT_APP_CLIENT_ID; // Client ID for OAuth2
const clientSecret = process.env.REACT_APP_CLIENT_SECRET; // Client secret for OAuth2
const redirectURI = process.env.REACT_APP_REDIRECT_URI; // Redirect URI for OAuth2

// Define OAuth2 scope
const scope = [
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/youtube',
  'https://www.googleapis.com/auth/youtube.force-ssl'
];

const auth = new OAuth2(clientId, clientSecret, redirectURI); // Initialize OAuth2 client

const youtubeService = {}; // Create an object to hold YouTube service functions

// Generate authorization URL and redirect the user to Google's OAuth2 server
youtubeService.getCode = (response) => {
  const authUrl = auth.generateAuthUrl({
    access_type: 'offline',
    scope
  });
  console.log('authUrl:', authUrl);
  response.redirect(authUrl);
};

// Exchange authorization code for access tokens
youtubeService.getTokensWithCode = async (code) => {
  try {
    const { tokens } = await auth.getToken(code);
    youtubeService.authorize(tokens); // Authorize the client with the received tokens
  } catch (error) {
    console.error('Error getting tokens with code:', error);
  }
};

// Set credentials with the received tokens
youtubeService.authorize = (tokens) => {
  auth.setCredentials(tokens);
  console.log('Successfully set credentials');
  console.log('tokens:', tokens);
  save('./tokens.json', JSON.stringify(tokens)); // Save tokens to a file
};

// Listen for token events and save refresh tokens to a file
auth.on('tokens', (tokens) => {
  if (tokens.refresh_token) {
    save('./tokens.json', JSON.stringify(auth.tokens));
    console.log('Refresh token:', tokens.refresh_token);
  }
  console.log('Access token:', tokens.access_token);
});

// Check if tokens are saved locally and set credentials if they are
const checkTokens = async () => {
  const tokens = await read('./tokens.json');
  if (tokens) {
    auth.setCredentials(tokens);
    console.log('tokens set');
  } else {
    console.log('no tokens set');
  }
};

// Insert a message into a live chat
youtubeService.insertMessage = (messageText, liveChatId) => {
  if (isDeveloperMode) {
    console.log(`Developer Mode: Message "${messageText}" would be inserted to live chat ID: ${liveChatId}`);
    return;
  }

  try {
    youtube.liveChatMessages.insert({
      auth,
      part: 'snippet',
      resource: {
        snippet: {
          type: 'textMessageEvent',
          liveChatId,
          textMessageDetails: {
            messageText
          }
        }
      }
    }, () => {});
    logQuotaUsage('liveChatMessages.insert', 50); // Log the quota usage without displaying
  } catch (error) {
    console.error('Error inserting message:', error);
  }
};

// Fetch messages from a live chat
youtubeService.fetchChatMessages = async (liveChatId) => {
  if (isDeveloperMode) {
    console.log(`Developer Mode: Fetching chat messages for live chat ID: ${liveChatId}`);
    return [
      {
        text: 'Test message 1',
        author: 'Test Author 1',
        authorProfileImageUrl: 'https://example.com/profile1.jpg',
        timestamp: new Date().toISOString(),
      },
      {
        text: 'Test message 2',
        author: 'Test Author 2',
        authorProfileImageUrl: 'https://example.com/profile2.jpg',
        timestamp: new Date().toISOString(),
      }
    ];
  }

  try {
    const url = `https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=${liveChatId}&part=snippet,authorDetails&key=${process.env.API_KEY}`;
    const response = await axios.get(url);
    const { data } = response;

    logQuotaUsage('liveChat/messages', 1); // Log the quota usage without displaying

    return data.items.map(item => ({
      text: item.snippet.displayMessage,
      author: item.authorDetails.displayName,
      authorProfileImageUrl: item.authorDetails.profileImageUrl,
      timestamp: item.snippet.publishedAt,
    }));
  } catch (error) {
    console.error('Error fetching chat messages:', error.response ? error.response.data : error.message);
    return [];
  }
};

// Check and set tokens at the start
checkTokens();

// Export the YouTube service object
module.exports = youtubeService;
