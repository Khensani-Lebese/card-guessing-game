const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // Serve static files (CSS/JS)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve `ejs` templates
app.set("view engine", "ejs");

// Load scores from db.json
const getScores = () => {
  const data = JSON.parse(fs.readFileSync("db.json"));
  return data.scores || [];
};

// Save scores to db.json
const saveScores = (scores) => {
  fs.writeFileSync("db.json", JSON.stringify({ scores }, null, 2));
};

// Routes

// Home Page (Game Page)
app.get("/", (req, res) => {
  res.render("index");
});

// View Scores Page
app.get("/scores", (req, res) => {
  const scores = getScores();
  res.render("scores", { scores });
});

// Fetch Highest Score
app.get("/highest-score", (req, res) => {
  const scores = getScores();
  if (scores.length === 0) {
    return res.json({ username: "No scores yet", time: "" });
  }
  const best = scores.reduce((best, current) =>
    current.time < best.time ? current : best
  );
  res.json(best);
});

app.post("/submit-score", (req, res) => {
  const { username, time } = req.body; // Destructure correctly
  console.log("Request Body:", req.body);

  // Simulate fetching and saving scores
  const scores = getScores();
  scores.push(req.body);
  saveScores(scores);
  console.log("Score saved:", req.body);
  // Respond with success
  res.status(200).json({ message: "Score submitted successfully" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
