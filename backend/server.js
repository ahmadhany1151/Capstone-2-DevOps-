const express = require("express");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "127.0.0.1";

// pg reads PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD automatically
const pool = new Pool();

pool.on("error", (err) => {
  console.error("Unexpected database error:", err.message);
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from the backend" });
});

app.get("/api/messages", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, text, created_at FROM messages ORDER BY id"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Database query failed:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(PORT, HOST, () => {
  console.log(`Backend listening on http://${HOST}:${PORT}`);
});
