// Fruit Catcher Game State
const fruitCatcherState = {
  canvas: null,
  ctx: null,
  player: { x: 275, y: 350, width: 50, height: 50, speed: 7 },
  fruits: [],
  bombs: [],
  scoreIndicators: [],
  score: 0,
  missed: 0,
  gameStarted: false,
  gameOver: false,
  keys: {},
  animationId: null,
  lastFruitSpawn: 0,
  lastBombSpawn: 0,
  fruitSpawnRate: 1500,
  bombSpawnRate: 3000,
  fruitTypes: ["🍎", "🍊", "🍋", "🍌", "🍇", "🍓", "🍑", "🍉"],
};

// Fruit Catcher Game
export function renderFruitCatcherGame(app, renderMainMenu) {
  app.innerHTML = `
    <div class="game-container">
      <div class="game-header">
        <h2>Fruit Catcher</h2>
        <button class="back-button" id="back-btn">← Back to Menu</button>
      </div>
      <div class="game-stats">
        <div class="stat">Score: <span id="score">0</span></div>
        <div class="stat">Missed: <span id="missed">0</span></div>
      </div>
      <canvas id="fruit-canvas"></canvas>
      <div class="game-controls">
        <p>Use ← → Arrow Keys to Move | Press SPACE to Start | Avoid 💣 Bombs!</p>
      </div>
    </div>
  `;

  document.getElementById("back-btn").addEventListener("click", () => {
    if (fruitCatcherState.animationId) {
      cancelAnimationFrame(fruitCatcherState.animationId);
    }
    // Clean up event listeners
    document.removeEventListener("keydown", handleKeyDown);
    document.removeEventListener("keyup", handleKeyUp);
    renderMainMenu();
  });

  initFruitCatcher();
}

function initFruitCatcher() {
  const canvas = document.getElementById("fruit-canvas");
  const ctx = canvas.getContext("2d");

  // Set canvas to fullscreen
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  fruitCatcherState.canvas = canvas;
  fruitCatcherState.ctx = ctx;
  fruitCatcherState.fruits = [];
  fruitCatcherState.bombs = [];
  fruitCatcherState.scoreIndicators = [];
  fruitCatcherState.score = 0;
  fruitCatcherState.missed = 0;
  fruitCatcherState.gameStarted = false;
  fruitCatcherState.gameOver = false;
  fruitCatcherState.player.x = canvas.width / 2 - 25;
  fruitCatcherState.player.y = canvas.height - 100;
  fruitCatcherState.lastFruitSpawn = 0;
  fruitCatcherState.lastBombSpawn = 0;
  fruitCatcherState.fruitSpawnRate = 1500;
  fruitCatcherState.bombSpawnRate = 3000;

  // Keyboard controls
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);

  gameLoop();
}

function handleKeyDown(e) {
  if (e.key === " " && !fruitCatcherState.gameStarted) {
    fruitCatcherState.gameStarted = true;
    fruitCatcherState.lastFruitSpawn = Date.now();
    fruitCatcherState.lastBombSpawn = Date.now();
  }
  fruitCatcherState.keys[e.key] = true;
}

function handleKeyUp(e) {
  fruitCatcherState.keys[e.key] = false;
}

function spawnFruit() {
  const fruit = {
    x: Math.random() * (fruitCatcherState.canvas.width - 40),
    y: -40,
    size: 30,
    speed: 2 + Math.random() * 2,
    emoji:
      fruitCatcherState.fruitTypes[
        Math.floor(Math.random() * fruitCatcherState.fruitTypes.length)
      ],
  };
  fruitCatcherState.fruits.push(fruit);
}

function spawnBomb() {
  const bomb = {
    x: Math.random() * (fruitCatcherState.canvas.width - 40),
    y: -40,
    size: 30,
    speed: 2.5 + Math.random() * 1.5,
    emoji: "💣",
  };
  fruitCatcherState.bombs.push(bomb);
}

function addScoreIndicator(x, y, text, color) {
  fruitCatcherState.scoreIndicators.push({
    x,
    y,
    text,
    color,
    opacity: 1,
    lifetime: 0,
  });
}

function updateGame() {
  if (!fruitCatcherState.gameStarted) return;

  const state = fruitCatcherState;
  const player = state.player;

  // Move player
  if (state.keys["ArrowLeft"] && player.x > 0) {
    player.x -= player.speed;
  }
  if (
    state.keys["ArrowRight"] &&
    player.x < state.canvas.width - player.width
  ) {
    player.x += player.speed;
  }

  // Spawn fruits
  const now = Date.now();
  if (now - state.lastFruitSpawn > state.fruitSpawnRate) {
    spawnFruit();
    state.lastFruitSpawn = now;
    // Gradually increase difficulty
    if (state.fruitSpawnRate > 600) {
      state.fruitSpawnRate -= 10;
    }
  }

  // Spawn bombs
  if (now - state.lastBombSpawn > state.bombSpawnRate) {
    spawnBomb();
    state.lastBombSpawn = now;
    // Gradually spawn bombs more frequently
    if (state.bombSpawnRate > 1500) {
      state.bombSpawnRate -= 20;
    }
  }

  // Update fruits
  for (let i = state.fruits.length - 1; i >= 0; i--) {
    const fruit = state.fruits[i];
    fruit.y += fruit.speed;

    // Check collision with player
    if (
      fruit.y + fruit.size > player.y &&
      fruit.y < player.y + player.height &&
      fruit.x + fruit.size > player.x &&
      fruit.x < player.x + player.width
    ) {
      state.fruits.splice(i, 1);
      state.score += 10;
      document.getElementById("score").textContent = state.score;
      addScoreIndicator(
        player.x + player.width / 2,
        player.y - 10,
        "+10",
        "#4ade80"
      );
    }
    // Check if fruit missed
    else if (fruit.y > state.canvas.height) {
      state.fruits.splice(i, 1);
      state.missed++;
      document.getElementById("missed").textContent = state.missed;

      if (state.missed >= 10) {
        state.gameOver = true;
      }
    }
  }

  // Update bombs
  for (let i = state.bombs.length - 1; i >= 0; i--) {
    const bomb = state.bombs[i];
    bomb.y += bomb.speed;

    // Check collision with player
    if (
      bomb.y + bomb.size > player.y &&
      bomb.y < player.y + player.height &&
      bomb.x + bomb.size > player.x &&
      bomb.x < player.x + player.width
    ) {
      state.bombs.splice(i, 1);
      state.score = Math.max(0, state.score - 20);
      document.getElementById("score").textContent = state.score;
      addScoreIndicator(
        player.x + player.width / 2,
        player.y - 10,
        "-20",
        "#ef4444"
      );
    }
    // Remove if off screen
    else if (bomb.y > state.canvas.height) {
      state.bombs.splice(i, 1);
    }
  }

  // Update score indicators
  for (let i = state.scoreIndicators.length - 1; i >= 0; i--) {
    const indicator = state.scoreIndicators[i];
    indicator.lifetime += 16; // Approximate ms per frame
    indicator.y -= 1; // Float upward
    indicator.opacity = 1 - indicator.lifetime / 1000; // Fade out over 1 second

    if (indicator.lifetime > 1000) {
      state.scoreIndicators.splice(i, 1);
    }
  }
}

function drawGame() {
  const state = fruitCatcherState;
  const ctx = state.ctx;
  const canvas = state.canvas;

  // Clear canvas
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw player (placeholder - will be replaced with PNG later)
  ctx.fillStyle = "#646cff";
  ctx.fillRect(
    state.player.x,
    state.player.y,
    state.player.width,
    state.player.height
  );

  // Add a simple face to the player
  ctx.fillStyle = "#fff";
  ctx.fillRect(state.player.x + 12, state.player.y + 15, 8, 8); // Left eye
  ctx.fillRect(state.player.x + 30, state.player.y + 15, 8, 8); // Right eye

  // Draw smile
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(state.player.x + 25, state.player.y + 30, 10, 0, Math.PI);
  ctx.stroke();

  // Draw fruits
  ctx.font = "30px Arial";
  state.fruits.forEach((fruit) => {
    ctx.fillText(fruit.emoji, fruit.x, fruit.y + fruit.size);
  });

  // Draw bombs
  state.bombs.forEach((bomb) => {
    ctx.fillText(bomb.emoji, bomb.x, bomb.y + bomb.size);
  });

  // Draw score indicators
  state.scoreIndicators.forEach((indicator) => {
    ctx.save();
    ctx.globalAlpha = indicator.opacity;
    ctx.fillStyle = indicator.color;
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "center";
    ctx.fillText(indicator.text, indicator.x, indicator.y);
    ctx.restore();
  });
  ctx.textAlign = "left";

  // Draw start message
  if (!state.gameStarted) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#646cff";
    ctx.font = "32px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Press SPACE to Start!", canvas.width / 2, canvas.height / 2);
    ctx.fillStyle = "#888";
    ctx.font = "20px Arial";
    ctx.fillText(
      "Catch fruits 🍎 (+10) | Avoid bombs 💣 (-20)",
      canvas.width / 2,
      canvas.height / 2 + 40
    );
    ctx.textAlign = "left";
  }

  // Draw game over
  if (state.gameOver) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ff4444";
    ctx.font = "48px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2 - 30);
    ctx.fillStyle = "#fff";
    ctx.font = "24px Arial";
    ctx.fillText(
      `Final Score: ${state.score}`,
      canvas.width / 2,
      canvas.height / 2 + 20
    );
    ctx.fillStyle = "#888";
    ctx.font = "18px Arial";
    ctx.fillText(
      "Click 'Back to Menu' to play again",
      canvas.width / 2,
      canvas.height / 2 + 60
    );
    ctx.textAlign = "left";
  }
}

function gameLoop() {
  updateGame();
  drawGame();

  if (!fruitCatcherState.gameOver) {
    fruitCatcherState.animationId = requestAnimationFrame(gameLoop);
  }
}
