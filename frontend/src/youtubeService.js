const { google } = require('googleapis');
const util = require('util');
const fs = require('fs');

let nextPage;
const intervalTime = 200;
let interval;
let chatMessages = [];

const writeFilePromise = util.promisify(fs.writeFile);
const readFilePromise = util.promisify(fs.readFile);

const save = async (path, str) => {
  try {
    await writeFilePromise(path, str);
    console.log('Successfully Saved:', path);
  } catch (error) {
    console.error('Error saving file:', path, error);
  }
};

const read = async (path) => {
  try {
    const fileContents = await readFilePromise(path);
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading file:', path, error);
    return null;
  }
};

const youtube = google.youtube('v3');
const OAuth2 = google.auth.OAuth2;

const clientId = '554599515355-s5gld7a23htip5k0nhcet10u7kaf324p.apps.googleusercontent.com';
const clientSecret = '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';
const redirectURI = 'http://localhost:3001/oauth2callback';

const scope = [
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/youtube',
  'https://www.googleapis.com/auth/youtube.force-ssl'
];

const auth = new OAuth2(clientId, clientSecret, redirectURI);

const youtubeService = {};

youtubeService.getCode = (response) => {
  const authUrl = auth.generateAuthUrl({
    access_type: 'offline',
    scope
  });
  console.log('authUrl:', authUrl);
  response.redirect(authUrl);
};

youtubeService.getTokensWithCode = async (code) => {
  try {
    const { tokens } = await auth.getToken(code);
    youtubeService.authorize(tokens);
  } catch (error) {
    console.error('Error getting tokens with code:', error);
  }
};

youtubeService.authorize = (tokens) => {
  auth.setCredentials(tokens);
  console.log('Successfully set credentials');
  console.log('tokens:', tokens);
  save('./tokens.json', JSON.stringify(tokens));
};


auth.on('tokens', (tokens) => {
  if (tokens.refresh_token) {
    save('./tokens.json', JSON.stringify(auth.tokens));
    console.log('Refresh token:', tokens.refresh_token);
  }
  console.log('Access token:', tokens.access_token);
});

const checkTokens = async () => {
  const tokens = await read('./tokens.json');
  if (tokens) {
    auth.setCredentials(tokens);
    console.log('tokens set');
  } else {
    console.log('no tokens set');
  }
};

youtubeService.insertMessage = (messageText, liveChatId) => {
  console.log('asdasd:', messageText);
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
  } catch (error) {
    console.error('Error inserting message:', error);
  }
};

checkTokens();

module.exports = youtubeService;
