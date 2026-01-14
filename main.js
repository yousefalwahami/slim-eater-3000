import "./style.css";
import { renderMainMenu } from "./game-menu.js";
import { renderSquareGame } from "./game-square.js";
import { renderFruitCatcherGame } from "./game-fruit-catcher.js";

// Game state
let currentGame = null;

// Get the app container
const app = document.querySelector("#app");

// Main menu wrapper
function showMainMenu() {
  currentGame = null;
  renderMainMenu(app, loadGame);
}

// Game loader
function loadGame(gameName) {
  currentGame = gameName;

  switch (gameName) {
    case "square":
      renderSquareGame(app, showMainMenu);
      break;
    case "fruitCatcher":
      renderFruitCatcherGame(app, showMainMenu);
      break;
    default:
      showMainMenu();
  }
}

// Initialize the app
showMainMenu();
