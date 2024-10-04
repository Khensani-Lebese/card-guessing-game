const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Load scores from JSON file
const loadScores = () => {
    try {
        return JSON.parse(fs.readFileSync('./data/scores.json'));
    } catch (error) {
        return [];
    }
};

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/scores', (req, res) => {
    const scores = loadScores();
    res.render('scores', { scores });
});

app.post('/submit-score', (req, res) => {
    const { username, time } = req.body;
    const scores = loadScores();
    scores.push({ username, time });
    fs.writeFileSync('./data/scores.json', JSON.stringify(scores, null, 2));
    res.redirect('/scores');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
