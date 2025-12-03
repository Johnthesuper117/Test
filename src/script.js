// Classes (same as before)
class Character {
  constructor(name, hp, attack, defense) {
    this.name = name;
    this.maxHp = hp;
    this.hp = hp;
    this.attack = attack;
    this.defense = defense;
    this.x = 0;
    this.y = 0;
  }

  isAlive() {
    return this.hp > 0;
  }

  takeDamage(damage) {
    this.hp -= damage;
    if (this.hp < 0) {
      this.hp = 0;
    }
    this.logMessage(`${this.name} takes ${damage} damage!`);
    this.updateStatsDisplay();
  }

  attackTarget(target) {
    const damage = Math.max(0, this.attack - target.defense); // Ensure damage isn't negative
    target.takeDamage(damage);
    this.logMessage(`${this.name} attacks ${target.name} for ${damage} damage!`);
  }

  logMessage(message) {
    const messageLog = document.getElementById("messageLog");
    messageLog.textContent += message + "\n";
    messageLog.scrollTop = messageLog.scrollHeight; // Auto-scroll
  }

  updateStatsDisplay() {
    // Implemented in subclasses.
  }
}

class Player extends Character {
  constructor(name = "Hero") {
    super(name, 100, 15, 5);
    this.inventory = [];
  }

  updateStatsDisplay() {
    const playerStatsDiv = document.getElementById("playerStats");
    playerStatsDiv.textContent = `Player: ${this.name} | HP: ${this.hp}/${this.maxHp} | Attack: ${this.attack} | Defense: ${this.defense}`;

    const inventoryDiv = document.getElementById("inventory");
    inventoryDiv.textContent = `Inventory: ${this.inventory.map(item => item.name).join(", ")}`;
  }

  addItem(item) {
    this.inventory.push(item);
    this.logMessage(`Picked up ${item.name}`);
    this.updateStatsDisplay();
    this.populateItemSelect();
  }

  useItem(item) {
    if (!this.inventory.includes(item)) {
      this.logMessage("You don't have that item!");
      return;
    }

    item.use(this);
    this.inventory = this.inventory.filter(i => i !== item); // Remove used item
    this.updateStatsDisplay();
    this.populateItemSelect();
  }

  populateItemSelect() {
      const itemSelect = document.getElementById("itemSelect");
      itemSelect.innerHTML = ""; // Clear existing options
      this.inventory.forEach(item => {
          const option = document.createElement("option");
          option.value = item.name;
          option.textContent = item.name;
          itemSelect.appendChild(option);
      });
  }

  move(dx, dy) {
    let newX = this.x + dx;
    let newY = this.y + dy;

    if (newX >= 0 && newX < levelWidth && newY >= 0 && newY < levelHeight && level[newY][newX] === '.') {
      this.x = newX;
      this.y = newY;
      updateGameBoard();
      return true; // Indicate successful move
    }
    return false; //Indicate failed move
  }
}

class Enemy extends Character {
  constructor(name, hp, attack, defense, aiType = 'basic') {
    super(name, hp, attack, defense);
    this.aiType = aiType;
  }

  updateStatsDisplay() {
    const enemyStatsDiv = document.getElementById("enemyStats");
    enemyStatsDiv.textContent = `Enemy: ${this.name} | HP: ${this.hp}/${this.maxHp} | Attack: ${this.attack} | Defense: ${this.defense}`;
  }

  aiTurn() {
    if (this.aiType === 'basic') {
      this.basicAI();
    } else {
      // Potentially more complex AI types here
      this.logMessage(`${this.name} does nothing.`);
    }
  }

  basicAI() {
    // Simple AI: Attack if in range, otherwise do nothing
    const distanceX = Math.abs(this.x - player.x);
    const distanceY = Math.abs(this.y - player.y);

    if (distanceX <= 1 && distanceY <= 1) {
      this.attackTarget(player);
    } else {
      //Basic movement towards player
      let dx = 0;
      let dy = 0;

      if (player.x < this.x) {
          dx = -1;
      } else if (player.x > this.x) {
          dx = 1;
      }

      if (player.y < this.y) {
          dy = -1;
      } else if (player.y > this.y) {
          dy = 1;
      }

      this.move(dx, dy);
    }
  }

  move(dx, dy) {
    let newX = this.x + dx;
    let newY = this.y + dy;

    if (newX >= 0 && newX < levelWidth && newY >= 0 && newX < levelHeight && level[newY][newX] === '.') {
      this.x = newX;
      this.y = newY;
      updateGameBoard();
      return true; // Indicate successful move
    }
    return false; //Indicate failed move
  }
}

class Item {
  constructor(name, description, use) {
    this.name = name;
    this.description = description;
    this.use = use;
  }
}

// Game State
let player;
let enemy;
let currentLevel = 1;
let level;
let levelWidth;
let levelHeight;
let gameBoardDiv;
let isPlayerTurn = true;

// Items
const healthPotion = new Item(
  "Health Potion",
  "Restores 20 HP.",
  (user) => {
    user.hp = Math.min(user.maxHp, user.hp + 20);
    user.logMessage(`${user.name} drinks a health potion and recovers 20 HP.`);
    user.updateStatsDisplay();
  }
);

const strengthElixir = new Item(
    "Strength Elixir",
    "Temporarily increases attack by 5.",
    (user) => {
      user.attack += 5;
      user.logMessage(`${user.name} drinks a Strength Elixir! Attack increased.`);
      user.updateStatsDisplay();
      setTimeout(() => {
        user.attack -= 5; // Revert after a delay
        user.logMessage(`${user.name}'s Strength Elixir wears off.`);
        user.updateStatsDisplay();
      }, 10000); // 10 seconds
    }
  );

const ironShield = new Item(
    "Iron Shield",
    "Temporarily increases defense by 5.",
    (user) => {
      user.defense += 5;
      user.logMessage(`${user.name} equips an Iron Shield! Defense increased.`);
      user.updateStatsDisplay();
      setTimeout(() => {
        user.defense -= 5; // Revert after a delay
        user.logMessage(`${user.name}'s Iron Shield loses effectiveness.`);
        user.updateStatsDisplay();
      }, 10000); // 10 seconds
    }
  );

// Keybindings
let keybindings = {
  moveUp: "w",
  moveDown: "s",
  moveLeft: "a",
  moveRight: "d",
  attack: "j",
  useItem: "k"
};

// Game Functions
function initializeGame() {
  player = new Player();
  gameBoardDiv = document.getElementById("gameBoard");

  // Add initial items
  player.addItem(healthPotion);
  player.addItem(strengthElixir);
  player.addItem(ironShield);

  // Setup event listeners
  document.getElementById("settingsButton").addEventListener("click", openSettings);
  document.getElementById("saveSettingsButton").addEventListener("click", saveSettings);
  document.getElementById("closeSettingsButton").addEventListener("click", closeSettings);

  loadSettings(); // Load keybindings from localStorage, if any

  //Keydown Event Listener
  document.addEventListener("keydown", handleKeyInput);

  generateLevel(currentLevel);
}

function generateLevel(levelNumber) {
  //Larger Map
  level = [
      "################################",
      "#..............................#",
      "#...#...#...#...#...#...#...#.#",
      "#.................#...........#",
      "#.#####.#####.#####.####.####.#",
      "#...#...#.......#.......#...#.#",
      "#.................#...........#",
      "#...#...#...#...#...#...#...#.#",
      "#.................#...........#",
      "#.#####.#####.#####.####.####.#",
      "#..............................#",
      "#...#...#...#...#...#...#...#.#",
      "#.................#...........#",
      "################################"
  ];

  levelWidth = level[0].length;
  levelHeight = level.length;

  // Place player at start
  player.x = 1;
  player.y = 1;

  // Place enemy (basic placement for now)
  enemy = new Enemy(`Goblin (Lvl ${levelNumber})`, 30 + (levelNumber * 10), 8 + (levelNumber * 2), 2 + levelNumber, 'basic');
  enemy.x = levelWidth - 2;
  enemy.y = levelHeight - 2;

  updateLevelDisplay();
  updateGameBoard();
  player.updateStatsDisplay();
  enemy.updateStatsDisplay();
}

function updateGameBoard() {
  let boardString = "";
  for (let y = 0; y < levelHeight; y++) {
    for (let x = 0; x < levelWidth; x++) {
      if (x === player.x && y === player.y) {
        boardString += "P"; // Player
      } else if (x === enemy.x && y === enemy.y && enemy.isAlive()) {
        boardString += "E"; // Enemy
      } else {
        boardString += level[y][x];
      }
    }
    boardString += "\n"; // Newline at end of each row
  }
  gameBoardDiv.textContent = boardString;
}

function updateLevelDisplay() {
    document.getElementById("levelDisplay").textContent = `Level: ${currentLevel}`;
}

function playerAttack() {
  if (!isPlayerTurn) return;

  player.attackTarget(enemy);

  if (!enemy.isAlive()) {
    endCombat(true); // Player wins
    return;
  }

  endPlayerTurn();
}

function playerMove(dx, dy) {
  if (!isPlayerTurn) return;

  if (player.move(dx, dy)) {
    endPlayerTurn();
  } else {
    player.logMessage("Cannot move there.");
  }
}

function useSelectedItem() {
  if (!isPlayerTurn) return;

  const itemSelect = document.getElementById("itemSelect");
  const itemName = itemSelect.value;
  const item = player.inventory.find(item => item.name === itemName);

  if (item) {
    player.useItem(item);
    endPlayerTurn();
  } else {
    player.logMessage("No item selected.");
  }
}

function endPlayerTurn() {
  isPlayerTurn = false;
  enemyTurn();
}

function enemyTurn() {
  enemy.aiTurn();

  if (!player.isAlive()) {
    endCombat(false); // Enemy wins
    return;
  }

  isPlayerTurn = true; // Back to player
  player.updateStatsDisplay(); // Update stats in case enemy attacked
}

function endCombat(playerWon) {
  if (playerWon) {
    player.logMessage("You defeated the enemy!");
    currentLevel++;
    generateLevel(currentLevel); // Next level
  } else {
    player.logMessage("You were defeated!");
    // Reset Game
    currentLevel = 1;
    initializeGame();
  }
}

function handleKeyInput(event) {
  const key = event.key.toLowerCase();

  if (key === keybindings.moveUp) {
    playerMove(0, -1);
  } else if (key === keybindings.moveDown) {
    playerMove(0, 1);
  } else if (key === keybindings.moveLeft) {
    playerMove(-1, 0);
  } else if (key === keybindings.moveRight) {
    playerMove(1, 0);
  } else if (key === keybindings.attack) {
    playerAttack();
  } else if (key === keybindings.useItem) {
    useSelectedItem();
  }
}

// Settings Menu Functions
function openSettings() {
  document.getElementById("settingsMenu").style.display = "block";
  // Populate settings fields with current values
  document.getElementById("moveUpKey").value = keybindings.moveUp;
  document.getElementById("moveDownKey").value = keybindings.moveDown;
  document.getElementById("moveLeftKey").value = keybindings.moveLeft;
  document.getElementById("moveRightKey").value = keybindings.moveRight;
  document.getElementById("attackKey").value = keybindings.attack;
  document.getElementById("useItemKey").value = keybindings.useItem;
}

function saveSettings() {
  keybindings.moveUp = document.getElementById("moveUpKey").value.toLowerCase();
  keybindings.moveDown = document.getElementById("moveDownKey").value.toLowerCase();
  keybindings.moveLeft = document.getElementById("moveLeftKey").value.toLowerCase();
  keybindings.moveRight = document.getElementById("moveRightKey").value.toLowerCase();
  keybindings.attack = document.getElementById("attackKey").value.toLowerCase();
  keybindings.useItem = document.getElementById("useItemKey").value.toLowerCase();

  localStorage.setItem("keybindings", JSON.stringify(keybindings)); // Save to localStorage

  closeSettings();
  player.logMessage("Settings saved.");
}

function closeSettings() {
  document.getElementById("settingsMenu").style.display = "none";
}

function loadSettings() {
  const savedSettings = localStorage.getItem("keybindings");
  if (savedSettings) {
    keybindings = JSON.parse(savedSettings);
  }
}

// Initialization
initializeGame();
