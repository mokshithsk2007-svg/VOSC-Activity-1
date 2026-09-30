// ---------- Constants ----------
// All 8 possible winning combinations (by cell index)
const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6]             // diagonals
];

// ---------- DOM elements ----------
const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restart-btn");
const resetScoresBtn = document.getElementById("reset-scores-btn");
const playerXBox = document.getElementById("player-x");
const playerOBox = document.getElementById("player-o");
const scoreXText = document.getElementById("score-x");
const scoreOText = document.getElementById("score-o");
const scoreDrawText = document.getElementById("score-draw");

// ---------- Game state ----------
let board = Array(9).fill("");   // "" = empty, otherwise "X" or "O"
let currentPlayer = "X";
let gameActive = true;
let scores = { X: 0, O: 0, draws: 0 };

// ---------- Functions ----------

// Set up a fresh game (scores are kept)
function startGame() {
  board = Array(9).fill("");
  currentPlayer = "X";
  gameActive = true;

  cells.forEach(function (cell) {
    cell.textContent = "";
    cell.className = "cell";
    cell.disabled = false;
  });

  statusText.className = "status";
  updateTurnDisplay();
}

// Show whose turn it is
function updateTurnDisplay() {
  statusText.textContent = "Player " + currentPlayer + "'s turn";
  playerXBox.classList.toggle("active", currentPlayer === "X");
  playerOBox.classList.toggle("active", currentPlayer === "O");
}

// Handle a click on a cell
function handleCellClick(event) {
  const cell = event.currentTarget;
  const index = Number(cell.dataset.index);

  // Prevent invalid moves: game over or cell already taken
  if (!gameActive || board[index] !== "") {
    return;
  }

  placeMark(cell, index);

  const winningLine = getWinningLine();

  if (winningLine) {
    endGameWithWinner(winningLine);
  } else if (isDraw()) {
    endGameWithDraw();
  } else {
    switchPlayer();
  }
}

// Put the current player's mark on the board and screen
function placeMark(cell, index) {
  board[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer.toLowerCase(), "pop");
  cell.disabled = true;
}

// Return the winning combination if there is one, otherwise null
function getWinningLine() {
  for (const combo of WINNING_COMBINATIONS) {
    const [a, b, c] = combo;
    if (board[a] !== "" && board[a] === board[b] && board[a] === board[c]) {
      return combo;
    }
  }
  return null;
}

// Draw = every cell filled and no winner
function isDraw() {
  return board.every(function (value) {
    return value !== "";
  });
}

// Change to the other player
function switchPlayer() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateTurnDisplay();
}

// Winner found: highlight, update score, lock the board
function endGameWithWinner(winningLine) {
  gameActive = false;

  winningLine.forEach(function (index) {
    cells[index].classList.add("winner");
  });

  scores[currentPlayer]++;
  updateScoreboard();

  statusText.textContent = "🎉 Player " + currentPlayer + " wins!";
  statusText.className = "status win";
  lockBoard();
}

// Draw: update score and lock the board
function endGameWithDraw() {
  gameActive = false;
  scores.draws++;
  updateScoreboard();

  statusText.textContent = "It's a draw! 🤝";
  statusText.className = "status draw";
  playerXBox.classList.remove("active");
  playerOBox.classList.remove("active");
  lockBoard();
}

// Disable all cells so nothing else can be clicked
function lockBoard() {
  cells.forEach(function (cell) {
    cell.disabled = true;
  });
}

// Refresh the scoreboard numbers
function updateScoreboard() {
  scoreXText.textContent = scores.X;
  scoreOText.textContent = scores.O;
  scoreDrawText.textContent = scores.draws;
}

// Reset everything, including scores
function resetScores() {
  scores = { X: 0, O: 0, draws: 0 };
  updateScoreboard();
  startGame();
}

// ---------- Event listeners ----------
cells.forEach(function (cell) {
  cell.addEventListener("click", handleCellClick);
});
restartBtn.addEventListener("click", startGame);
resetScoresBtn.addEventListener("click", resetScores);

// ---------- Start ----------
startGame();