# K-pop Livestream Website 
This project analyzes **YouTube Live chat messages** in real time to extract **sentiment**, **topics**, and **language detection**, using a modular microservice architecture built with Docker.

It features:
- A **React frontend** for user interaction  
- A **Node.js + Express backend** to handle logic and routing  
- A **Python Flask API** running VADER sentiment analysis and Gemini API calls  
- A **SQL database** for storing video and chat metadata  
- A **Dockerized architecture** that works seamlessly across machines  

---

## 🔧 Features

- 🔍 Real-time YouTube chat fetching via YouTube Data API  
- 🧠 AI-generated summaries and topics (Gemini API)  
- 🌐 Language detection  
- 🐳 Fully containerized with Docker + Docker Compose  

---

## 🧱 Project Structure


```plaintext
project-root/
│
├── frontend/              # React frontend (user interface)
│   └── Dockerfile
│
├── backend/               # Express server
│   └── Dockerfile
│
├── flask-api/             # Python Gemini + VADER service
│   └── Dockerfile
│
├── db/                    # SQL init scripts and storage
│   └── script.sql
│
├── docker-compose.yml     # Multi-container config
└── README.md              # You're here!
```
---

## 🚀 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/)  
- [Docker Compose](https://docs.docker.com/compose/)  
- YouTube API key (add it to your environment variables or `.env` file)

---

### 🔨 Run the App

1. Clone the repository:

```bash
git clone https://github.com/yourusername/live-chat-analysis.git
cd live-chat-analysis
```

2. Build and run all containers:

```bash
docker-compose up --build
```

3. Visit the frontend in your browser:
```bash
http://localhost:3000
```

## Ports

| Service       | Description     | Port (localhost) |
|---------------|-----------------|------------------|
| Frontend      | React App       | 3000             |
| Backend       | Node.js/Express | 5000             |
| Python API    | Flask App       | 8000             |
| SQL Database  | MySQL           | 3306             |


## 🤖 Gemini API (LLM Integration)

The **Gemini API** is a free Large Language Model (LLM) API used in this project to analyze YouTube Live chat content and generate:

- 📌 Summaries of the chat  
- 🧵 Key topics  
- 🌍 Detected languages  

This functionality is implemented in the **`flask-api`** container using **Python**. The API is called by sending a prompt that includes the livestream title, description, and a batch of recent chat messages. Gemini then returns structured output, which is parsed and sent back to the frontend.

---

### ⚠️ API Usage Limits

Although Gemini is free, it has the following rate limits:

- ⏱️ **15 requests per minute**  
- 📊 **1,500 requests per day**

These limits are suitable for local development and testing. However, for production or heavy usage, rate limits may become restrictive. To scale up, Google offers **pay-as-you-go** or **subscription plans** for higher quotas.

---

### 🧾 Example Prompt

```text
Extract three key topics that describe the overall conversation. This is to be displayed at the top of chat to give a quick overview of the conversation.
Title: {video_title}
Description: {video_description}
Messages: {messages}
Output format: Each item must be wrapped in double quotes, followed by one emoji, with a single space between the quoted text and the emoji. Separate multiple items using commas, all on one line per category. No explanations; just return the output in the format above.
