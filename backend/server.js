const express = require("express");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "127.0.0.1";

// One JSON object per line. Errors go to stderr, everything else to stdout.
function log(level, message, extra = {}) {
  const line = JSON.stringify({
    time: new Date().toISOString(),
    level,
    message,
    ...extra,
  });
  if (level === "error") {
    console.error(line);
  } else {
    console.log(line);
  }
}

// pg reads PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD automatically
const pool = new Pool();

pool.on("error", (err) => {
  log("error", "Unexpected database error", { error: err.message });
});

// Log every request once the response has been sent
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    log("info", "request", {
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      ms: Date.now() - start,
    });
  });
  next();
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
    log("error", "Database query failed", { error: err.message });
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(PORT, HOST, () => {
  log("info", "Backend started", { host: HOST, port: Number(PORT) });
});
