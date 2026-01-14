// Main menu component
export function renderMainMenu(app, loadGame) {
  app.innerHTML = `
    <div class="main-menu">
      <h1>🎮 Slim Eater 3000</h1>
      <div class="game-buttons">
        <button id="game1-btn">Square Game</button>
        <button id="game2-btn">🍎 Slim Catcher</button>
      </div>
    </div>
  `;

  // Add event listeners
  document
    .getElementById("game1-btn")
    .addEventListener("click", () => loadGame("square"));
  document
    .getElementById("game2-btn")
    .addEventListener("click", () => loadGame("fruitCatcher"));
}
