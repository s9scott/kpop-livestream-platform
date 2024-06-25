
const CLIENT_ID = '554599515355-s5gld7a23htip5k0nhcet10u7kaf324p.apps.googleusercontent.com';
const REDIRECT_URI = 'http://localhost:3000/oauth2callback';
const SCOPE = "https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.force-ssl";
const RESPONSE_TYPE = "code";
const ACCESS_TYPE = "offline";
 
const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${encodeURIComponent(SCOPE)}&response_type=${RESPONSE_TYPE}&access_type=${ACCESS_TYPE}`;

export default authUrl;