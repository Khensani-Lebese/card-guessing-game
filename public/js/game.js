document.addEventListener('DOMContentLoaded', () => {
  const gameBoard = document.getElementById('game-board');
  const timerDisplay = document.getElementById('timer');
  let timer;
  let timeElapsed = 0;
  let highScoreTime;

  // Array containing 18 pairs of programming languages for a total of 36 cards
  const programmingLanguages = [
    'JavaScript', 'JavaScript', 'Python', 'Python',
    'Java', 'Java', 'C#', 'C#',
    'Ruby', 'Ruby', 'PHP', 'PHP',
    'Swift', 'Swift', 'Go', 'Go',
    'C++', 'C++', 'Kotlin', 'Kotlin',
    'Rust', 'Rust', 'TypeScript', 'TypeScript',
    'HTML', 'HTML', 'CSS', 'CSS',
    'SQL', 'SQL', 'Dart', 'Dart',
    'Scala', 'Scala', 'Perl', 'Perl'
  ];

  let firstCard = null;
  let secondCard = null;
  let matchedPairs = 0;

  const fetchHighScore = async () => {
    const response = await fetch('/scores');
    const scores = await response.json();
    highScoreTime = scores.length > 0 ? Math.min(...scores.map(score => score.time)) : Infinity;
  };

  const startTimer = () => {
    timer = setInterval(() => {
      timeElapsed++;
      timerDisplay.textContent = `Time: ${new Date(timeElapsed * 1000).toISOString().substr(11, 8)}`;
    }, 1000);
  };

  const stopTimer = () => clearInterval(timer);

  const resetGame = () => {
    timeElapsed = 0;
    timerDisplay.textContent = 'Time: 00:00:00';
    stopTimer();
    matchedPairs = 0;
    firstCard = null;
    secondCard = null;
    gameBoard.innerHTML = '';
    initializeGame();
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  const checkMatch = () => {
    if (firstCard.dataset.value === secondCard.dataset.value) {
      matchedPairs++;
      if (matchedPairs === programmingLanguages.length / 2) {
        stopTimer();
        setTimeout(() => handleWin(), 500);
      }
      firstCard = null;
      secondCard = null;
    } else {
      setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        firstCard.textContent = '';
        secondCard.textContent = '';
        firstCard = null;
        secondCard = null;
      }, 1000);
    }
  };

  const handleWin = () => {
    if (timeElapsed < highScoreTime) {
      const username = prompt('Amazing! You set a new record! Enter your name, Programming Champion:');
      if (username) saveHighScore(username, timeElapsed);
    } else {
      alert('You’ve matched all the programming languages! Well done!');
    }
  };

  const saveHighScore = (username, time) => {
    fetch('/save-score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, time }),
    })
    .then(response => response.json())
    .then(data => alert(data.message))
    .catch(error => console.error('Error saving score:', error));
  };

  const cardClick = (event) => {
    const card = event.target;
    if (!card.classList.contains('flipped') && !firstCard) {
      card.classList.add('flipped');
      card.textContent = card.dataset.value;
      firstCard = card;
    } else if (!card.classList.contains('flipped') && !secondCard) {
      card.classList.add('flipped');
      card.textContent = card.dataset.value;
      secondCard = card;
      checkMatch();
    }
  };

  const initializeGame = () => {
    shuffleArray(programmingLanguages);
    programmingLanguages.forEach(language => {
      const cardElement = document.createElement('div');
      cardElement.classList.add('card');
      cardElement.dataset.value = language;
      cardElement.textContent = ''; // Initially hide the item
      cardElement.addEventListener('click', cardClick);
      gameBoard.appendChild(cardElement);
    });
    startTimer();
    fetchHighScore();
  };

  document.getElementById('reset-btn').addEventListener('click', resetGame);
  initializeGame();
});
