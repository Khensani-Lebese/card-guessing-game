document.addEventListener("DOMContentLoaded", () => {
  const gameBoard = document.getElementById("game-board");
  const timerDisplay = document.getElementById("timer");
  let timer;
  let timeElapsed = 0;
  let matchedPairs = 0;
  let firstCard = null;
  let secondCard = null;

  const programmingLanguages = [
    "JavaScript",
    "JavaScript",
    "Python",
    "Python",
    "Java",
    "Java",
    "C#",
    "C#",
    "Ruby",
    "Ruby",
    "PHP",
    "PHP",
    "Swift",
    "Swift",
    "Go",
    "Go",
    "C++",
    "C++",
    "Kotlin",
    "Kotlin",
    "Rust",
    "Rust",
    "TypeScript",
    "TypeScript",
    "HTML",
    "HTML",
    "CSS",
    "CSS",
    "SQL",
    "SQL",
    "Dart",
    "Dart",
    "Scala",
    "Scala",
    "Perl",
    "Perl",
  ];

  const startTimer = () => {
    if (timer) return; // Prevent multiple timers from being set.

    timer = setInterval(() => {
      timeElapsed++;
      const formattedTime = new Date(timeElapsed * 1000)
        .toISOString()
        .substr(11, 8);
      timerDisplay.textContent = `Time: ${formattedTime}`;
    }, 1000);
  };

  const submitButton = document
    .getElementById("submit-score-form")
    .querySelector("button");
  submitButton.disabled = true;

  const stopTimer = () => clearInterval(timer);

  const checkMatch = () => {
    if (firstCard.dataset.value === secondCard.dataset.value) {
      matchedPairs++;
      if (matchedPairs === programmingLanguages.length / 2) {
        stopTimer();
        alert(
          "You’ve matched all the programming languages! Well done! Submit your score"
        );
        submitButton.disabled = false;
      }
      firstCard = secondCard = null;
    } else {
      setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        firstCard = secondCard = null;
      }, 1000);
    }
  };

  const cardClick = (e) => {
    const card = e.target;
    if (!card.classList.contains("flipped") && !firstCard) {
      card.classList.add("flipped");
      card.textContent = card.dataset.value;
      firstCard = card;
    } else if (!card.classList.contains("flipped") && !secondCard) {
      card.classList.add("flipped");
      card.textContent = card.dataset.value;
      secondCard = card;
      checkMatch();
    }
  };

  const initializeGame = () => {
    gameBoard.innerHTML = "";
    programmingLanguages.sort(() => 0.5 - Math.random());
    programmingLanguages.forEach((language) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.dataset.value = language;
      card.addEventListener("click", cardClick);
      gameBoard.appendChild(card);
    });
    startTimer();
  };

  initializeGame();
});
