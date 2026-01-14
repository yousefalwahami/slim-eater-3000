// Slim Catcher Game State
const fruitCatcherState = {
  canvas: null,
  ctx: null,
  player: { x: 275, y: 350, width: 100, height: 140, speed: 8 },
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
  fruitTypes: ["🍕", "🍔", "🍟", "🌭", "🍗", "🍣", "🌮", "🌯"],
  // Character sprites
  slimIdle: null,
  slimEating: null,
  isEating: false,
  eatingTimer: 0,
  imagesLoaded: false,
  // Map backgrounds
  selectedMap: null,
  mapImage: null,
  showMapSelection: true,
  // Sounds
  sounds: {
    bgMusic: null,
    eatSound: null,
    bombSound: null,
    gameOverSound: null,
  },
  soundsLoaded: false,
  musicMuted: false,
};

// Slim Catcher Game
export function renderFruitCatcherGame(app, renderMainMenu) {
  app.innerHTML = `
    <div class="game-container">
      <div class="game-header">
        <h2>Slim Catcher</h2>
        <div class="header-buttons">
          <button class="mute-button" id="mute-btn">🔊 Music</button>
          <button class="back-button" id="back-btn">← Back to Menu</button>
        </div>
      </div>
      <div class="game-stats">
        <div class="stat">Score: <span id="score">0</span></div>
        <div class="stat">Missed: <span id="missed">0</span></div>
      </div>
      <div id="map-selector" class="map-selector" style="display: none;">
        <h3>Select a Map</h3>
        <div class="map-buttons">
          <button class="map-btn" id="map1-btn">
            <img src="/assets/cei-1.jpg" alt="Map 1" />
            <span>Map 1</span>
          </button>
          <button class="map-btn" id="map2-btn">
            <img src="/assets/cei-2.jpg" alt="Map 2" />
            <span>Map 2</span>
          </button>
        </div>
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
    // Stop music
    if (fruitCatcherState.sounds.bgMusic) {
      fruitCatcherState.sounds.bgMusic.pause();
      fruitCatcherState.sounds.bgMusic.currentTime = 0;
    }
    // Clean up event listeners
    document.removeEventListener("keydown", handleKeyDown);
    document.removeEventListener("keyup", handleKeyUp);
    renderMainMenu();
  });

  // Mute button handler
  document.getElementById("mute-btn").addEventListener("click", () => {
    toggleMusic();
  });

  // Map selection handlers
  const mapSelector = document.getElementById("map-selector");
  mapSelector.style.display = "flex";

  document.getElementById("map1-btn").addEventListener("click", () => {
    selectMap("cei-1");
  });

  document.getElementById("map2-btn").addEventListener("click", () => {
    selectMap("cei-2");
  });
}

function selectMap(mapName) {
  fruitCatcherState.selectedMap = mapName;
  document.getElementById("map-selector").style.display = "none";
  initFruitCatcher();
}
function toggleMusic() {
  const state = fruitCatcherState;
  const muteBtn = document.getElementById("mute-btn");

  state.musicMuted = !state.musicMuted;

  if (state.sounds.bgMusic) {
    if (state.musicMuted) {
      state.sounds.bgMusic.pause();
      muteBtn.textContent = "🔇 Music";
    } else {
      if (state.gameStarted && !state.gameOver) {
        state.sounds.bgMusic
          .play()
          .catch((e) => console.log("Music play failed:", e));
      }
      muteBtn.textContent = "🔊 Music";
    }
  }
}
function initFruitCatcher() {
  const canvas = document.getElementById("fruit-canvas");
  const ctx = canvas.getContext("2d");

  // Set canvas to fullscreen with proper pixel ratio for sharp rendering
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";

  // Scale context to account for pixel ratio
  ctx.scale(dpr, dpr);

  fruitCatcherState.canvas = canvas;
  fruitCatcherState.ctx = ctx;
  fruitCatcherState.fruits = [];
  fruitCatcherState.bombs = [];
  fruitCatcherState.scoreIndicators = [];
  fruitCatcherState.score = 0;
  fruitCatcherState.missed = 0;
  fruitCatcherState.gameStarted = false;
  fruitCatcherState.gameOver = false;
  fruitCatcherState.player.x = window.innerWidth / 2 - 50;
  fruitCatcherState.player.y = window.innerHeight - 180;
  fruitCatcherState.lastFruitSpawn = 0;
  fruitCatcherState.lastBombSpawn = 0;
  fruitCatcherState.fruitSpawnRate = 1500;
  fruitCatcherState.bombSpawnRate = 3000;
  fruitCatcherState.isEating = false;
  fruitCatcherState.eatingTimer = 0;
  fruitCatcherState.imagesLoaded = false;

  // Load character sprites
  const slimIdle = new Image();
  const slimEating = new Image();

  let imagesLoadedCount = 0;
  const onImageLoad = () => {
    imagesLoadedCount++;
    if (imagesLoadedCount === 2) {
      fruitCatcherState.imagesLoaded = true;
    }
  };

  slimIdle.onload = onImageLoad;
  slimEating.onload = onImageLoad;
  slimIdle.src = "/assets/slim-1.png";
  slimEating.src = "/assets/slim-2.png";

  fruitCatcherState.slimIdle = slimIdle;
  fruitCatcherState.slimEating = slimEating;

  // Load map background
  const mapImage = new Image();
  mapImage.onload = () => {
    fruitCatcherState.mapImage = mapImage;
  };
  mapImage.src = `/assets/${fruitCatcherState.selectedMap}.jpg`;

  // Load sounds
  try {
    fruitCatcherState.sounds.bgMusic = new Audio("/assets/bazooka.mp3");
    fruitCatcherState.sounds.bgMusic.loop = true;
    fruitCatcherState.sounds.bgMusic.volume = 0.05;

    fruitCatcherState.sounds.eatSound = new Audio("/assets/nom.mp3");
    fruitCatcherState.sounds.eatSound.volume = 0.5;

    fruitCatcherState.sounds.bombSound = new Audio("/assets/nom.mp3");
    fruitCatcherState.sounds.bombSound.volume = 0.5;

    fruitCatcherState.sounds.gameOverSound = new Audio("/assets/game-over.mp3");
    fruitCatcherState.sounds.gameOverSound.volume = 0.5;

    fruitCatcherState.soundsLoaded = true;
  } catch (error) {
    console.log("Sounds not loaded:", error);
  }

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

    // Start background music if not muted
    if (fruitCatcherState.sounds.bgMusic && !fruitCatcherState.musicMuted) {
      fruitCatcherState.sounds.bgMusic
        .play()
        .catch((e) => console.log("Music play failed:", e));
    }
  }
  fruitCatcherState.keys[e.key] = true;
}

function handleKeyUp(e) {
  fruitCatcherState.keys[e.key] = false;
}

function spawnFruit() {
  const fruit = {
    x: Math.random() * (window.innerWidth - 80),
    y: -80,
    size: 60,
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
    x: Math.random() * (window.innerWidth - 80),
    y: -80,
    size: 60,
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
  if (state.keys["ArrowRight"] && player.x < window.innerWidth - player.width) {
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
      // Trigger eating animation
      state.isEating = true;
      state.eatingTimer = 200; // Show eating sprite for 200ms

      // Play eat sound
      if (state.sounds.eatSound) {
        state.sounds.eatSound.currentTime = 0;
        state.sounds.eatSound
          .play()
          .catch((e) => console.log("Sound play failed:", e));
      }
    }
    // Check if fruit missed
    else if (fruit.y > window.innerHeight) {
      state.fruits.splice(i, 1);
      state.missed++;
      document.getElementById("missed").textContent = state.missed;

      if (state.missed >= 10) {
        state.gameOver = true;

        // Stop music and play game over sound
        if (state.sounds.bgMusic) {
          state.sounds.bgMusic.pause();
          state.sounds.bgMusic.currentTime = 0;
        }
        if (state.sounds.gameOverSound) {
          state.sounds.gameOverSound
            .play()
            .catch((e) => console.log("Sound play failed:", e));
        }
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
      // Trigger eating animation
      state.isEating = true;
      state.eatingTimer = 200; // Show eating sprite for 200ms

      // Play bomb sound
      if (state.sounds.bombSound) {
        state.sounds.bombSound.currentTime = 0;
        state.sounds.bombSound
          .play()
          .catch((e) => console.log("Sound play failed:", e));
      }
    }
    // Remove if off screen
    else if (bomb.y > window.innerHeight) {
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

  // Update eating animation timer
  if (state.isEating) {
    state.eatingTimer -= 16; // Approximate ms per frame
    if (state.eatingTimer <= 0) {
      state.isEating = false;
    }
  }
}

function drawGame() {
  const state = fruitCatcherState;
  const ctx = state.ctx;

  // Draw background map
  if (state.mapImage && state.mapImage.complete) {
    ctx.drawImage(state.mapImage, 0, 0, window.innerWidth, window.innerHeight);
  } else {
    // Clear canvas with solid color if map not loaded
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  }

  // Draw player
  if (state.imagesLoaded) {
    const currentSprite = state.isEating ? state.slimEating : state.slimIdle;
    ctx.drawImage(
      currentSprite,
      state.player.x,
      state.player.y,
      state.player.width,
      state.player.height
    );
  } else {
    // Fallback placeholder while images load
    ctx.fillStyle = "#646cff";
    ctx.fillRect(
      state.player.x,
      state.player.y,
      state.player.width,
      state.player.height
    );
  }

  // Draw fruits
  ctx.font = "60px Arial";
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
    ctx.font = "bold 36px Arial";
    ctx.textAlign = "center";
    ctx.fillText(indicator.text, indicator.x, indicator.y);
    ctx.restore();
  });
  ctx.textAlign = "left";

  // Draw start message
  if (!state.gameStarted) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.fillStyle = "#646cff";
    ctx.font = "48px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      "Press SPACE to Start!",
      window.innerWidth / 2,
      window.innerHeight / 2
    );
    ctx.fillStyle = "#888";
    ctx.font = "28px Arial";
    ctx.fillText(
      "Catch fast food 🍕 (+10) | Avoid bombs 💣 (-20)",
      window.innerWidth / 2,
      window.innerHeight / 2 + 40
    );
    ctx.textAlign = "left";
  }

  // Draw game over
  if (state.gameOver) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.fillStyle = "#ff4444";
    ctx.font = "64px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      "Game Over!",
      window.innerWidth / 2,
      window.innerHeight / 2 - 30
    );
    ctx.fillStyle = "#fff";
    ctx.font = "32px Arial";
    ctx.fillText(
      `Final Score: ${state.score}`,
      window.innerWidth / 2,
      window.innerHeight / 2 + 20
    );
    ctx.fillStyle = "#888";
    ctx.font = "24px Arial";
    ctx.fillText(
      "Click 'Back to Menu' to play again",
      window.innerWidth / 2,
      window.innerHeight / 2 + 60
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
