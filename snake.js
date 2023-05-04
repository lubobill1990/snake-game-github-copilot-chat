// Set up the canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;

// Set up the snake
let snake = [{ x: 10, y: 10 }];
let dx = 10;
let dy = 0;

// Set up the food
let food = { x: Math.floor(Math.random() * (width / 10)) * 10, y: Math.floor(Math.random() * (height / 10)) * 10 };

// Set up the obstacles
let obstacles = [];
for (let i = 0; i < 10; i++) {
  obstacles.push({ x: Math.floor(Math.random() * (width / 10)) * 10, y: Math.floor(Math.random() * (height / 10)) * 10 });
}

// Set up the game loop
function gameLoop() {
  // Move the snake
  let head = { x: snake[0].x + dx, y: snake[0].y + dy };
  if (head.x < 0) {
    head.x = width - 10;
  } else if (head.x >= width) {
    head.x = 0;
  }
  if (head.y < 0) {
    head.y = height - 10;
  } else if (head.y >= height) {
    head.y = 0;
  }
  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    // Snake ate the food
    food = { x: Math.floor(Math.random() * (width / 10)) * 10, y: Math.floor(Math.random() * (height / 10)) * 10 };
  } else {
    // Remove the tail
    snake.pop();
  }

  // Check for game over
  if (snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y) || obstacles.some(obstacle => obstacle.x === head.x && obstacle.y === head.y)) {
    clearInterval(intervalId);
    alert("Game over!");
  }

  // Draw the game board
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "green";
  snake.forEach(segment => ctx.fillRect(segment.x, segment.y, 10, 10));
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, 10, 10);
  ctx.fillStyle = "gray";
  obstacles.forEach(obstacle => ctx.fillRect(obstacle.x, obstacle.y, 10, 10));
}

let intervalId = setInterval(gameLoop, 100);

// Set up the keyboard controls
document.addEventListener("keydown", event => {
  switch (event.key) {
    case "ArrowLeft":
      dx = -10;
      dy = 0;
      break;
    case "ArrowRight":
      dx = 10;
      dy = 0;
      break;
    case "ArrowUp":
      dx = 0;
      dy = -10;
      break;
    case "ArrowDown":
      dx = 0;
      dy = 10;
      break;
  }
});

// Set up the touch controls
let touchStartX = null;
let touchStartY = null;
document.addEventListener("touchstart", event => {
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
});
document.addEventListener("touchmove", event => {
  if (touchStartX === null || touchStartY === null) {
    return;
  }
  let touchEndX = event.touches[0].clientX;
  let touchEndY = event.touches[0].clientY;
  let dx = touchEndX - touchStartX;
  let dy = touchEndY - touchStartY;
  if (Math.abs(dx) > Math.abs(dy)) {
    // Horizontal swipe
    if (dx > 0) {
      // Swipe right
      dx = 10;
      dy = 0;
    } else {
      // Swipe left
      dx = -10;
      dy = 0;
    }
  } else {
    // Vertical swipe
    if (dy > 0) {
      // Swipe down
      dx = 0;
      dy = 10;
    } else {
      // Swipe up
      dx = 0;
      dy = -10;
    }
  }
  // Update the snake direction
  if (dx !== -snake[0].dx && dy !== -snake[0].dy) {
    snake[0].dx = dx;
    snake[0].dy = dy;
  }
  // Reset touch start coordinates
  touchStartX = null;
  touchStartY = null;
});