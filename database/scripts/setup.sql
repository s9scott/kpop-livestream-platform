use template_db;

CREATE TABLE PrivateChats (
    chat_id INT AUTO_INCREMENT PRIMARY KEY,
    video_url VARCHAR(255) NOT NULL, -- URL of the video being watched
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp when the chat was created
);

CREATE TABLE PrivateChatMembers (
    member_id INT AUTO_INCREMENT PRIMARY KEY,
    chat_id INT NOT NULL,
    user_id INT NOT NULL, -- Reference to a User table if it exists
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- When the user joined the chat
    FOREIGN KEY (chat_id) REFERENCES PrivateChats(chat_id) ON DELETE CASCADE
);

CREATE TABLE PrivateChatMessages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    chat_id INT NOT NULL,
    sender_id INT NOT NULL, -- User who sent the message
    content TEXT NOT NULL, -- Message content
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp of the message
    FOREIGN KEY (chat_id) REFERENCES PrivateChats(chat_id) ON DELETE CASCADE
);

CREATE TABLE live_streams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  video_id VARCHAR(255) UNIQUE,
  title VARCHAR(255),
  description TEXT,
  published_at DATETIME,
  url VARCHAR(255)
);

CREATE TABLE live_chat_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  live_stream_id INT,
  message_text TEXT,
  user_id VARCHAR(255),
  timestamp DATETIME,
  FOREIGN KEY (live_stream_id) REFERENCES live_streams(id)
);

CREATE TABLE live_chat_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(255) UNIQUE,
  username VARCHAR(255),
  profile_picture VARCHAR(255)
);
