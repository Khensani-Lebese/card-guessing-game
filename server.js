const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const PORT = 3002;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Load scores from JSON file
const loadScores = () => {
  try {
    return JSON.parse(fs.readFileSync("./data/scores.json"));
  } catch (error) {
    return [];
  }
};

// Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/scores", (req, res) => {
  const scores = loadScores();
  res.render("scores", { scores });
});

//submit score only if youre done with the game
app.post("/submit-score", (req, res) => {
  const { username, time, isGameComplete } = req.body;

  if (isGameComplete !== "true") {
    return res.status(400).json({
      error:
        "Game not completed. Finish the game before submitting your score.",
    });
  }

  // Add the score if valid
  scores.push({ username, time });
  res.status(200).json({ message: "Score submitted successfully!" });
});

// Route to get the highest score
app.get("/highest-score", (req, res) => {
  if (!scores || scores.length === 0) {
    return res.json({ username: "No scores yet", time: "N/A" });
  }

  // Find the score with the shortest time
  const highestScore = scores.reduce((best, current) =>
    current.time < best.time ? current : best
  );

  res.json(highestScore);
});
if (scores.length === 0) {
  return res.json({ username: "N/A", time: "N/A" });
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
