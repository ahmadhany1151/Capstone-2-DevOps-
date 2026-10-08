CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO messages (text)
SELECT 'Hello from the database'
WHERE NOT EXISTS (SELECT 1 FROM messages);
