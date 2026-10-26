const GOAL_CANS = 20;
const GAME_LENGTH = 30;
const winningMessages = [
  'Amazing work! You reached the 20-can goal!',
  'You did it! Every second counted.',
  'Incredible speed. You reached the goal!'
];
const losingMessages = [
  'So close! Give it another try.',
  'Every can counts. Try again!',
  'The goal is within reach. Play again!'
];
const milestoneMessages = {
  5: 'Great start! You collected 5 cans.',
  10: 'Halfway there! You collected 10 cans.',
  15: 'Almost there! You collected 15 cans.',
  20: 'Milestone reached! You collected 20 cans!'
};
const catchMessages = [
  'Nice catch!',
  'Great job!',
  'Keep it up!'
];

let currentCans = 0;
let timeLeft = GAME_LENGTH;
let gameActive = false;
let spawnInterval;
let timerInterval;

function createGrid() {
  const grid = document.querySelector('.game-grid');
  grid.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell';
    grid.appendChild(cell);
  }
}

createGrid();

function spawnWaterCan() {
  if (!gameActive) return;
  const cells = document.querySelectorAll('.grid-cell');
  cells.forEach(cell => (cell.innerHTML = ''));
  const randomCell = cells[Math.floor(Math.random() * cells.length)];
  randomCell.innerHTML = `
    <div class="water-can-wrapper">
      <button class="water-can" type="button" aria-label="Collect water can"></button>
    </div>
  `;
}

function startGame() {
  if (gameActive) return;
  resetGame();
  gameActive = true;
  document.getElementById('game-feedback').textContent = 'Go! Catch as many cans as you can.';
  document.getElementById('start-game').textContent = 'Playing...';
  document.getElementById('start-game').disabled = true;
  spawnWaterCan();
  spawnInterval = setInterval(spawnWaterCan, 1000);
  timerInterval = setInterval(() => {
    timeLeft -= 1;
    document.getElementById('timer').textContent = timeLeft;
    if (timeLeft <= 0) endGame();
  }, 1000);
}

function resetGame() {
  gameActive = false;
  clearInterval(spawnInterval);
  clearInterval(timerInterval);
  currentCans = 0;
  timeLeft = GAME_LENGTH;
  document.getElementById('current-cans').textContent = currentCans;
  document.getElementById('timer').textContent = timeLeft;
  document.getElementById('game-feedback').textContent = 'Catch a can to earn a point!';
  const result = document.getElementById('achievements');
  result.textContent = '';
  result.className = 'achievement';
  document.getElementById('start-game').textContent = 'Start game';
  document.getElementById('start-game').disabled = false;
  document.querySelectorAll('.milestone-list [data-milestone]').forEach(milestone => {
    milestone.classList.remove('reached');
  });
  createGrid();
}

function endGame() {
  gameActive = false;
  clearInterval(spawnInterval);
  clearInterval(timerInterval);
  document.querySelectorAll('.grid-cell').forEach(cell => (cell.innerHTML = ''));

  const didWin = currentCans >= GOAL_CANS;
  const messages = didWin ? winningMessages : losingMessages;
  const message = messages[Math.floor(Math.random() * messages.length)];
  const result = document.getElementById('achievements');
  result.textContent = message;
  result.className = `achievement ${didWin ? 'win' : 'loss'}`;
  document.getElementById('start-game').textContent = 'Play again';
  document.getElementById('start-game').disabled = false;
}

document.querySelector('.game-grid').addEventListener('click', event => {
  if (!gameActive || !event.target.closest('.water-can')) return;
  currentCans += 1;
  document.getElementById('current-cans').textContent = currentCans;
  const feedback = milestoneMessages[currentCans] ||
    catchMessages[Math.floor(Math.random() * catchMessages.length)];
  document.getElementById('game-feedback').textContent = feedback;
  document.querySelectorAll('.milestone-list [data-milestone]').forEach(milestone => {
    if (currentCans >= Number(milestone.dataset.milestone)) {
      milestone.classList.add('reached');
    }
  });
  spawnWaterCan();
});

document.getElementById('start-game').addEventListener('click', startGame);
document.getElementById('reset-game').addEventListener('click', resetGame);
