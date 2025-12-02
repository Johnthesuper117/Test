const gameScreen = document.getElementById('game-screen');

// Game Map
const mapWidth = 30;
const mapHeight = 20;
let map = [];

// Player
let playerX = 1;
let playerY = 1;
const playerChar = '@';

// Functions

function generateMap() {
  map = [];
  for (let y = 0; y < mapHeight; y++) {
    map[y] = [];
    for (let x = 0; x < mapWidth; x++) {
      if (x === 0 || x === mapWidth - 1 || y === 0 || y === mapHeight - 1) {
        map[y][x] = '#'; // Walls
      } else {
        map[y][x] = '.'; // Empty space
      }
    }
  }
}

function drawMap() {
  let output = '';
  for (let y = 0; y < mapHeight; y++) {
    for (let x = 0; x < mapWidth; x++) {
      if (x === playerX && y === playerY) {
        output += playerChar;
      } else {
        output += map[y][x];
      }
    }
    output += '\n'; // Newline for each row
  }
  gameScreen.textContent = output;
}

function movePlayer(dx, dy) {
  const newX = playerX + dx;
  const newY = playerY + dy;

  if (newX >= 0 && newX < mapWidth && newY >= 0 && newY < mapHeight && map[newY][newX] !== '#') {
    playerX = newX;
    playerY = newY;
  }
}

// Event Listeners

document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowUp':
      movePlayer(0, -1);
      break;
    case 'ArrowDown':
      movePlayer(0, 1);
      break;
    case 'ArrowLeft':
      movePlayer(-1, 0);
      break;
    case 'ArrowRight':
      movePlayer(1, 0);
      break;
  }
  drawMap(); // Redraw after each move
});

// Game Initialization

function init() {
  generateMap();
  drawMap();
}

init();
