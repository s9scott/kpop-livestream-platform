const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 8080;

app.use(cors({
	origin: 'http://localhost:3000',
	methods: ['GET', 'POST'],
	allowedHeaders: ['Content-Type'],
}));

app.use(express.json());


app.post('/api/updateVideoDetails', async (req, res) => {
	src = req.body.chatSrc;
	getDetails(src);
});



app.post('/api/summarize', async (req, res) => {
  try {
      const { chatSrc } = req.body;
      
      if (!chatSrc) {
          return res.status(400).json({ error: "Missing chatSrc" });
      }
      const id = extractVideoId(chatSrc);

      const vidoeMessages = await getMessages(id); // Ensure async call is awaited
      //console.log("Fetched messages:", messages);
      
      const { videoTitle, videoDescription } = await getDetails(chatSrc, res); // Ensure async call is awaited
      const summary = await generateSummary(vidoeMessages, videoTitle, videoDescription); // If async, make sure it's awaited
          

      console.log("Generated Summary:", summary);

      res.status(200).json({ summary });
  } catch (error) {
      console.error("Error in /api/summarize:", error.message);
      res.status(500).json({ error: "Failed to generate summary" });
  }
});

//summary api
app.post('/api/topicModel', async (req, res) => {
  try {
      const { chatSrc } = req.body;
      
      if (!chatSrc) {
          return res.status(400).json({ error: "Missing chatSrc" });
      }

      const id = extractVideoId(chatSrc);

      const videoMessages = await getMessages(id); // Ensure async call is awaited
      //console.log("Fetched messages:", messages);
      
      const { videoTitle, videoDescription } = await getDetails(chatSrc, res); // Ensure async call is awaited
      const topics = await generateTopics(videoMessages, videoTitle, videoDescription ); // Ensure function exists
      console.log("Generated Topics:", topics);
      res.status(200).json({ topics });
  } catch (error) {
      console.error("Error in /api/topicModel:", error.message);
      res.status(500).json({ error: "Failed to generate topics" });
  }
});

//summary api
app.post('/api/getLanguages', async (req, res) => {
  try {
      const { chatSrc } = req.body;
      
      if (!chatSrc) {
          return res.status(400).json({ error: "Missing chatSrc" });
      }

      const id = extractVideoId(chatSrc);

      const videoMessages = await getMessages(id); // Ensure async call is awaited
      //console.log("Fetched messages:", messages);
      
      const { videoTitle, videoDescription } = await getDetails(chatSrc, res); // Ensure async call is awaited
      const languages = await generateLanguages(videoMessages, videoTitle, videoDescription ); // Ensure function exists
      console.log("Present Languages:", languages);
      res.status(200).json({ languages });
  } catch (error) {
      console.error("Error in /api/topicModel:", error.message);
      res.status(500).json({ error: "Failed to generate topics" });
  }
});

/**
 * 
 * @param {*} url 
 * @returns videoId
 */

const extractVideoId = (url) => {
  const match = url.match(/[?&]v=([^&]+)/);
  return match ? match[1] : null;
};

/**
 * 
 * @param {*} videoUrl 
 * @returns videoTitle and videoDescription
 */

async function getDetails(videoUrl) {
    const videoId = extractVideoId(videoUrl);

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${process.env.YOUTUBE_API_KEY}&part=snippet`
    );
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const snippet = data.items[0].snippet;
      return {
        videoTitle: snippet.title,
        videoDescription: snippet.description,
      };
    } else {
      throw new Error("Video not found");
    }
}

/**
 * 
 * @param {*} chatSrc 
 * @returns messages
 */

const getMessages = async (chatSrc) => {
  try {
      const liveChatId = await getLiveChatId(chatSrc);
      
      if (!liveChatId) {
          throw new Error("Invalid or missing liveChatId");
      }

      console.log(`Fetching messages for liveChatId: ${liveChatId}`);

      const url = `https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=${liveChatId}&part=snippet,authorDetails&key=${process.env.YOUTUBE_API_KEY}`;
      const response = await axios.get(url);
      const { data } = response;

      return data.items.map(item => ({
          text: item.snippet.displayMessage,
          author: item.authorDetails.displayName,
          timestamp: new Date(item.snippet.publishedAt).toLocaleString(),
      }));
  } catch (error) {
      console.error("Error fetching messages:", error.response ? error.response.data : error.message);
      return [];
  }
};

/**
 * 
 * @param {*} videoId 
 * @returns liveChatId
 */

const getLiveChatId = async (videoId) => {
	let liveChatId = '';
	//console.log(`Fetching live chat ID for video ID: ${videoId}`);
	try {
		const url = `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${videoId}&key=${process.env.YOUTUBE_API_KEY}`;
		//console.log(`Request URL: ${url}`);
		const response = await axios.get(url);
		//console.log(`Response data: ${JSON.stringify(response.data, null, 2)}`);

		if (response.data.items.length > 0 && response.data.items[0].liveStreamingDetails) {
			liveChatId = response.data.items[0].liveStreamingDetails.activeLiveChatId;
			console.log('Live Chat ID:', liveChatId);
			return liveChatId;
		} else {
			console.log('No live chat found for the video ID:', videoId);
			liveChatId = '';
		}
	} catch (error) {
		console.error('Error retrieving live chat ID:', error.response ? error.response.data : error.message);
		liveChatId = '';
	}
};

const generateSummary = async (chat_messages, chat_title, chat_description) => {
	const summaryRes = await axios.post(
    'http://analysis:5001/generateSummary',
    { chat_messages, numSentences: 5, chat_description, chat_title  },
    { headers: { 'Content-Type': 'application/json' } }  // ✅ Ensure JSON format
  );
	const summary = summaryRes.data;
	return summary;
}

const generateTopics = async (chat_messages, chat_description, chat_title) => {
	const response = await axios.post(
    'http://analysis:5001/generateTopics',
    { chat_messages, numTopics: 5, chat_description, chat_title  },
    { headers: { 'Content-Type': 'application/json' } }  // ✅ Ensure JSON format
  );
	const topics = response.data;
	return topics;
}

const generateLanguages = async (chat_messages, chat_description, chat_title) => {
	const response = await axios.post(
    'http://analysis:5001/generateLanguages',
    { chat_messages, chat_description, chat_title  },
    { headers: { 'Content-Type': 'application/json' } }  // ✅ Ensure JSON format
  );
	const languages = response.data;
	return languages;
}


app.listen(port, () => {
	console.log(`Backend running on http://localhost:${port}`);
	console.log(`host: ${process.env.DB_HOST}, user: ${process.env.DB_USER}, password: ${process.env.DB_PASSWORD}, database: ${process.env.DB_NAME}`)
});