// Game parameters
const MAP_WIDTH = 40;
const MAP_HEIGHT = 20;
const MAX_ROOMS = 10;
const MIN_ROOM_SIZE = 3;
const MAX_ROOM_SIZE = 8;

// Game state
let map = [];
let playerX, playerY;
let enemies = [];
let inventory = [];
let currentLevel = 1;

// DOM elements
const gameMapElement = document.getElementById("gameMap");
const messageLogElement = document.getElementById("messageLog");
const attackButton = document.getElementById("attackButton");
const inventoryItemsElement = document.getElementById("inventoryItems");

// Tile characters
const TILE_FLOOR = '.';
const TILE_WALL = '#';
const TILE_PLAYER = '@';
const TILE_ENEMY = 'E';
const TILE_ITEM = 'i';

// Item definitions
const ITEMS = [
  { name: "Potion", symbol: "!", effect: () => {
      // Simplified healing effect
      messageLogElement.textContent = "You drink a potion and feel better!";
  }}
];

// --- Helper Functions ---
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// --- Map Generation ---

function generateMap() {
  map = Array(MAP_HEIGHT).fill(null).map(() => Array(MAP_WIDTH).fill(TILE_WALL));

  const rooms = [];

  for (let i = 0; i < MAX_ROOMS; i++) {
    const width = getRandomInt(MIN_ROOM_SIZE, MAX_ROOM_SIZE);
    const height = getRandomInt(MIN_ROOM_SIZE, MAX_ROOM_SIZE);
    const x = getRandomInt(1, MAP_WIDTH - width - 1);
    const y = getRandomInt(1, MAP_HEIGHT - height - 1);

    const newRoom = { x, y, width, height };

    // Check for overlaps with existing rooms
    let overlap = false;
    for (const room of rooms) {
      if (isRoomOverlapping(newRoom, room)) {
        overlap = true;
        break;
      }
    }

    if (!overlap) {
      rooms.push(newRoom);
      createRoom(newRoom);
    }
  }

  // Connect the rooms
  for (let i = 0; i < rooms.length - 1; i++) {
    connectRooms(rooms[i], rooms[i + 1]);
  }

  // Place the player in the first room
  playerX = rooms[0].x + Math.floor(rooms[0].width / 2);
  playerY = rooms[0].y + Math.floor(rooms[0].height / 2);

  //Place enemies (simple placement, could be improved)
  for (let i = 0; i < 3; i++) {
      let enemyX, enemyY;
      do {
          enemyX = getRandomInt(1, MAP_WIDTH - 2);
          enemyY = getRandomInt(1, MAP_HEIGHT - 2);
      } while (map[enemyY][enemyX] !== TILE_FLOOR || (enemyX === playerX && enemyY === playerY));

      enemies.push({x: enemyX, y: enemyY, hp: 10});
  }

   // Place items (simplified placement)
   for (let i = 0; i < 2; i++) {
        let itemX, itemY;
        do {
            itemX = getRandomInt(1, MAP_WIDTH - 2);
            itemY = getRandomInt(1, MAP_HEIGHT - 2);
        } while (map[itemY][itemX] !== TILE_FLOOR || (itemX === playerX && itemY === playerY));
        map[itemY][itemX] = TILE_ITEM;
    }


}

function isRoomOverlapping(room1, room2) {
    return (
        room1.x < room2.x + room2.width &&
        room1.x + room1.width > room2.x &&
        room1.y < room2.y + room2.height &&
        room1.y + room1.height > room2.y
    );
}

function createRoom(room) {
  for (let y = room.y; y < room.y + room.height; y++) {
    for (let x = room.x; x < room.x + room.width; x++) {
      map[y][x] = TILE_FLOOR;
    }
  }
}

function connectRooms(room1, room2) {
  const startX = Math.floor(room1.x + room1.width / 2);
  const startY = Math.floor(room1.y + room1.height / 2);
  const endX = Math.floor(room2.x + room2.width / 2);
  const endY = Math.floor(room2.y + room2.height / 2);

  // Create a tunnel between the rooms (L-shaped)
  let currentX = startX;
  let currentY = startY;

  while (currentX !== endX) {
    currentX += (endX > currentX) ? 1 : -1;
    map[currentY][currentX] = TILE_FLOOR;
  }

  while (currentY !== endY) {
    currentY += (endY > currentY) ? 1 : -1;
    map[currentY][currentX] = TILE_FLOOR;
  }
}

// --- Game Logic ---

function updateMapDisplay() {
  let displayString = "";
  for (let y = 0; y < MAP_HEIGHT; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
        if (x === playerX && y === playerY) {
            displayString += TILE_PLAYER;
        } else {
            let enemyHere = false;
            for(const enemy of enemies) {
                if (enemy.x === x && enemy.y === y) {
                    displayString += TILE_ENEMY;
                    enemyHere = true;
                    break;
                }
            }
            if (!enemyHere) {
                displayString += map[y][x];
            }

        }

    }
    displayString += "\n";
  }
  gameMapElement.textContent = displayString;
}

function movePlayer(dx, dy) {
  const newX = playerX + dx;
  const newY = playerY + dy;

  if (newX >= 0 && newX < MAP_WIDTH && newY >= 0 && newY < MAP_HEIGHT && map[newY][newX] === TILE_FLOOR) {
    playerX = newX;
    playerY = newY;
    updateMapDisplay();
    moveEnemies();
    checkItemPickup();
  }
}

function moveEnemies() {
    for (const enemy of enemies) {
        //Simple movement: move randomly towards player
        const dx = Math.sign(playerX - enemy.x);
        const dy = Math.sign(playerY - enemy.y);

        const newX = enemy.x + dx;
        const newY = enemy.y + dy;

        if (newX >= 0 && newX < MAP_WIDTH && newY >= 0 && newY < MAP_HEIGHT && map[newY][newX] === TILE_FLOOR) {
            enemy.x = newX;
            enemy.y = newY;
        }
    }
    updateMapDisplay();
}

function checkItemPickup() {
    if (map[playerY][playerX] === TILE_ITEM) {
        map[playerY][playerX] = TILE_FLOOR;
        //Pick a random item
        const item = ITEMS[getRandomInt(0, ITEMS.length - 1)];
        inventory.push(item);
        updateInventoryDisplay();
        messageLogElement.textContent = `You found a ${item.name}!`;
        updateMapDisplay();
    }
}

function attack() {
  // Simplified attack logic
  messageLogElement.textContent = "You attack!";
}

function updateInventoryDisplay() {
    inventoryItemsElement.textContent = inventory.map(item => item.name).join(", ");
}

// --- Event Listeners ---
document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowUp":    movePlayer(0, -1); break;
    case "ArrowDown":  movePlayer(0, 1); break;
    case "ArrowLeft":  movePlayer(-1, 0); break;
    case "ArrowRight": movePlayer(1, 0); break;
  }
});

attackButton.addEventListener("click", attack);

// --- Initialization ---
generateMap();
updateMapDisplay();
updateInventoryDisplay();
