import "./style.css";

// Game state
let currentGame = null;

// Get the app container
const app = document.querySelector("#app");

// Main menu component
function renderMainMenu() {
  currentGame = null;
  app.innerHTML = `
    <div class="main-menu">
      <h1>🎮 Slim Eater 3000</h1>
      <div class="game-buttons">
        <button id="game1-btn">Square Game</button>
        <button id="game2-btn">Game 2 (Coming Soon)</button>
      </div>
    </div>
  `;

  // Add event listeners
  document
    .getElementById("game1-btn")
    .addEventListener("click", () => loadGame("square"));
  document
    .getElementById("game2-btn")
    .addEventListener("click", () => loadGame("game2"));
}

// Game loader
function loadGame(gameName) {
  currentGame = gameName;

  switch (gameName) {
    case "square":
      renderSquareGame();
      break;
    case "game2":
      renderPlaceholderGame("Game 2");
      break;
    default:
      renderMainMenu();
  }
}

// Square game - simple square that pulses
function renderSquareGame() {
  app.innerHTML = `
    <div class="game-container">
      <div class="game-header">
        <h2>Square Game</h2>
        <button class="back-button" id="back-btn">← Back to Menu</button>
      </div>
      <div class="game-canvas">
        <div class="square"></div>
      </div>
      <div class="game-info">
        <p>A simple pulsing square - more features coming soon!</p>
      </div>
    </div>
  `;

  document.getElementById("back-btn").addEventListener("click", renderMainMenu);
}

// Placeholder for future games
function renderPlaceholderGame(gameName) {
  app.innerHTML = `
    <div class="game-container">
      <div class="game-header">
        <h2>${gameName}</h2>
        <button class="back-button" id="back-btn">← Back to Menu</button>
      </div>
      <div class="game-canvas">
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #646cff; font-size: 2em;">
          Coming Soon! 🚧
        </div>
      </div>
      <div class="game-info">
        <p>This game is under development</p>
      </div>
    </div>
  `;

  document.getElementById("back-btn").addEventListener("click", renderMainMenu);
}

// Initialize the app
renderMainMenu();
