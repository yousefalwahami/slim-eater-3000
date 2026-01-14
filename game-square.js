// Square game - simple square that pulses
export function renderSquareGame(app, renderMainMenu) {
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
