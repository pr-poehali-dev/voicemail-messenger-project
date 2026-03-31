CREATE TABLE IF NOT EXISTS t_p68991375_voicemail_messenger_.users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  display_name VARCHAR(100),
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(30) UNIQUE,
  vk_id VARCHAR(100) UNIQUE,
  tg_id VARCHAR(100) UNIQUE,
  password_hash VARCHAR(255),
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  last_seen TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p68991375_voicemail_messenger_.sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES t_p68991375_voicemail_messenger_.users(id),
  token VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '30 days')
);