const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const uiOverlay = document.getElementById("ui-overlay");
const uiTitle = document.getElementById("ui-title");
const uiMsg = document.getElementById("ui-msg");
const actionBtn = document.getElementById("action-btn");
const scoreDisplay = document.getElementById("score-display");

// Game State Management
let gameState = "START"; // START, PLAYING, GAMEOVER
let score = 0;
let animationFrameId;

// Physics Configurations
const GRAVITY = 0.25;
const FLAP_STRENGTH = -5.5;
const PIPE_SPEED = 2;
const PIPE_SPAWN_RATE = 100; // Spawn every X frames
const PIPE_GAP = 130;

// Game Objects
let bird = { x: 50, y: 200, radius: 14, velocity: 0 };
let pipes = [];
let frameCounter = 0;

// Initialize / Reset Parameters
function initGame() {
  bird.y = 200;
  bird.velocity = 0;
  pipes = [];
  score = 0;
  frameCounter = 0;
  scoreDisplay.textContent = score;
}

// Handle User Input Controls
function handleAction() {
  if (gameState === "START") {
    gameState = "PLAYING";
    uiOverlay.classList.add("hide");
    scoreDisplay.classList.remove("hide");
    initGame();
    gameLoop();
  } else if (gameState === "PLAYING") {
    bird.velocity = FLAP_STRENGTH;
  } else if (gameState === "GAMEOVER") {
    gameState = "START";
    uiTitle.textContent = "FLAPPY BIRD";
    uiMsg.textContent = "Press Spacebar or Tap to Fly";
    actionBtn.textContent = "START GAME";
    scoreDisplay.classList.add("hide");
  }
}

// Event Listeners
window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault(); // Stop page scrolling
    handleAction();
  }
});
canvas.addEventListener("click", (e) => {
  e.preventDefault();
  handleAction();
});
actionBtn.addEventListener("click", (e) => {
  e.stopPropagation(); // Stop duplicate triggers on overlapping elements
  handleAction();
});

// Core Game Loop
function gameLoop() {
  if (gameState !== "PLAYING") return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  frameCounter++;

  // 1. Physics & Logic Updates
  bird.velocity += GRAVITY;
  bird.y += bird.velocity;

  // Handle Ceiling/Floor Boundaries
  if (bird.y + bird.radius >= canvas.height || bird.y - bird.radius <= 0) {
    endGame();
    return;
  }

  // Pipe Tracking Matrix
  if (frameCounter % PIPE_SPAWN_RATE === 0) {
    // Determine a safe dynamic height window for pipe generation
    const minHeight = 40;
    const maxHeight = canvas.height - PIPE_GAP - minHeight;
    const topPipeHeight =
      Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;

    pipes.push({
      x: canvas.width,
      topHeight: topPipeHeight,
      bottomHeight: canvas.height - topPipeHeight - PIPE_GAP,
      passed: false,
    });
  }

  // 2. Render and Manage Obstacles
  for (let i = pipes.length - 1; i >= 0; i--) {
    let p = pipes[i];
    p.x -= PIPE_SPEED;

    // Draw Top Pipe
    ctx.fillStyle = "#73bf2e";
    ctx.fillRect(p.x, 0, 50, p.topHeight);
    // Rim accent styling
    ctx.fillStyle = "#5c9e22";
    ctx.fillRect(p.x - 2, p.topHeight - 20, 54, 20);

    // Draw Bottom Pipe
    ctx.fillStyle = "#73bf2e";
    ctx.fillRect(p.x, canvas.height - p.bottomHeight, 50, p.bottomHeight);
    // Rim accent styling
    ctx.fillStyle = "#5c9e22";
    ctx.fillRect(p.x - 2, canvas.height - p.bottomHeight, 54, 20);

    // Box Collision Detection Calculations
    if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + 50) {
      if (
        bird.y - bird.radius < p.topHeight ||
        bird.y + bird.radius > canvas.height - p.bottomHeight
      ) {
        endGame();
        return;
      }
    }

    // Increment Score on successful pass
    if (!p.passed && p.x + 50 < bird.x) {
      p.passed = true;
      score++;
      scoreDisplay.textContent = score;
    }

    // Cleanup Offscreen elements from DOM Array
    if (p.x + 54 < 0) {
      pipes.splice(i, 1);
    }
  }

  // 3. Render Player Bird Character Asset
  ctx.beginPath();
  ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#f1c40f"; // Yellow Bird Body
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#000";
  ctx.stroke();
  ctx.closePath();

  // Draw Bird Eye
  ctx.beginPath();
  ctx.arc(bird.x + 6, bird.y - 4, 4, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.closePath();

  // Draw Bird Beak
  ctx.beginPath();
  ctx.fillStyle = "#e67e22";
  ctx.moveTo(bird.x + 12, bird.y - 2);
  ctx.lineTo(bird.x + 22, bird.y + 2);
  ctx.lineTo(bird.x + 12, bird.y + 6);
  ctx.fill();
  ctx.closePath();

  animationFrameId = requestAnimationFrame(gameLoop);
}

// Terminate Round and Display Statistics
function endGame() {
  gameState = "GAMEOVER";
  cancelAnimationFrame(animationFrameId);

  uiTitle.textContent = "GAME OVER";
  uiMsg.textContent = `Final Score: ${score}`;
  actionBtn.textContent = "TRY AGAIN";
  uiOverlay.classList.remove("hide");
}
