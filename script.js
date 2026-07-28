let canvas = document.querySelector("#flappy-canvas");
let context = canvas.getContext("2d");
let frames = 0;
let sprite = new Image();
sprite.src = "./img/flappy_bird_emelents.png";

let degree = Math.PI / 180;
const gameStates = {
  current: 0,
  getReady: 0,
  inGame: 1,
  gameOver: 2,
};

class Background {
  draw() {
    context.fillStyle = "#00d0ff";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }
}

class BackgroundImage {
  constructor(
    imageX = 0,
    imageY = 0,
    imageWidth = 144,
    imageHeight = 256,
    canvasX = 0,
    canvasY = 0,
    xVelocity = 2,
  ) {
    this.imageX = imageX;
    this.imageY = imageY;
    this.imageWidth = imageWidth;
    this.imageHeight = imageHeight;
    this.canvasX = canvasX;
    this.canvasY = canvasY;
    this.xVelocity = xVelocity;
  }
  draw() {
    context.drawImage(
      sprite,
      this.imageX,
      this.imageY,
      this.imageWidth,
      this.imageHeight,
      this.canvasX,
      this.canvasY,
      this.imageWidth * 2,
      this.imageHeight * 2,
    );
    context.drawImage(
      sprite,
      this.imageX,
      this.imageY,
      this.imageWidth,
      this.imageHeight,
      this.canvasX + this.imageWidth - 5,
      this.canvasY,
      this.imageWidth * 2,
      this.imageHeight * 2,
    );
  }

  update() {
    this.canvasX = (this.canvasX - this.xVelocity) % (this.imageWidth / 2);
    this.draw();
  }
}

class Foreground {
  constructor(
    imageX = 146,
    imageY = 0,
    imageWidth = 154,
    imageHeight = 56,
    canvasX = 0,
    canvasY = 400,
    xVelocity = 2,
  ) {
    this.imageX = imageX;
    this.imageY = imageY;
    this.imageWidth = imageWidth;
    this.imageHeight = imageHeight;
    this.canvasX = canvasX;
    this.canvasY = canvasY;
    this.xVelocity = xVelocity;
  }
  draw() {
    context.drawImage(
      sprite,
      this.imageX,
      this.imageY,
      this.imageWidth,
      this.imageHeight,
      this.canvasX,
      this.canvasY,
      this.imageWidth * 2,
      this.imageHeight * 2,
    );
    context.drawImage(
      sprite,
      this.imageX,
      this.imageY,
      this.imageWidth,
      this.imageHeight,
      this.canvasX + this.imageWidth,
      this.canvasY,
      this.imageWidth * 2,
      this.imageHeight * 2,
    );
  }

  update() {
    if (frames % 1 === 0) {
      this.canvasX = (this.canvasX - this.xVelocity) % (this.imageWidth - 100);
    }
    this.draw();
  }
}

class Bird {
  constructor(
    imageWidth = 17,
    imageHeight = 12,
    canvasX = 50,
    canvasY = 256,
    gravityPower = 0.5,
    airResistance = 0.95,
    zoom = 2,
    rotation = 0,
    jump = 9,
    radius = 12,
    birdHitScale = 0.8,
  ) {
    this.birdImageIndex = 0;
    this.birdImagesCoordinates = [
      { imageX: 264, imageY: 64 },
      { imageX: 264, imageY: 90 },
      { imageX: 223, imageY: 124 },
      { imageX: 264, imageY: 90 },
    ];
    this.imageWidth = imageWidth;
    this.imageHeight = imageHeight;
    this.canvasX = canvasX;
    this.canvasY = canvasY;
    this.gravityPower = gravityPower;
    this.airResistance = airResistance;
    this.zoom = zoom;
    this.rotation = rotation;
    this.jump = jump;
    this.radius = radius;
    this.birdHitScale = birdHitScale;
    this.yVelocity = this.jump * this.airResistance;
  }
  draw() {
    let birdFrame = this.birdImagesCoordinates[this.birdImageIndex];
    context.save();
    context.translate(this.canvasX, this.canvasY);
    context.rotate(this.rotation);
    context.drawImage(
      sprite,
      birdFrame.imageX,
      birdFrame.imageY,
      this.imageWidth,
      this.imageHeight,
      -(this.imageWidth * this.zoom) / 2,
      -(this.imageHeight * this.zoom) / 2,
      this.imageWidth * this.zoom,
      this.imageHeight * this.zoom,
    );
    context.restore();
  }
  update() {
    // first way:
    /*
    if (frames % 10 === 0) {
      if (this.birdImagesCoordinates.length - 1 === this.birdImageIndex) {
        this.birdImageIndex = 0;
        // this.draw();
      } else {
        this.birdImageIndex += 1;
        // this.draw();
      }
    }
    */
    //  second way:
    if (gameStates.current == gameStates.inGame) {
      this.birdImageIndex += frames % 10 === 0 ? 1 : 0;
      this.birdImageIndex =
        this.birdImageIndex % this.birdImagesCoordinates.length;
    }

    this.yVelocity += this.gravityPower;
    this.canvasY += this.yVelocity;
    // if (this.yVelocity <= 0 && this.rotation < 0) {
    //   this.rotation += 0.02;
    // }
    // else if (this.rotation < 0) {
    //   this.rotation += degree;
    // } else {
    //   this.rotation = 0;
    // }
    // if (this.rotation > 0) {
    //   this.rotation = 0;
    //   console.log(this.rotation);
    // }
    // this.rotation += degree;

    if (this.yVelocity + this.imageHeight + this.canvasY > foreground.canvasY) {
      this.canvasY = foreground.canvasY - this.imageHeight; // aligning with borders
      if (gameStates.current == gameStates.inGame) {
        triggerGameOver();
      }
    } else if (this.canvasY <= 0) {
      this.yVelocity = 0;
      this.canvasY = 10;
      triggerGameOver();
      // hit.play();
      // setTimeout(() => {
      //   die.play();
      // }, 300);
    }

    const degreeBooster = 6;
    const RadianTilt = 0.2;
    const RadianGroundAngle = 1.5;
    if (gameStates.current == gameStates.inGame && this.rotation < RadianTilt) {
      this.rotation += degree;
    } else if (
      gameStates.current == gameStates.gameOver &&
      this.rotation < RadianGroundAngle
    ) {
      // this.yVelocity += this.gravityPower;
      // this.canvasY += this.yVelocity;
      this.rotation += degree * degreeBooster;
    }
    this.draw();
  }
}

class Pipes {
  constructor(
    imageTopX = 302,
    imageTopY = 0,
    imageBottomX = 330,
    imageBottomY = 0,
    imageTopWidth = 26,
    imageTopHeight = 135,
    imageBottomWidth = 26,
    imageBottomHeight = 121,
    xVelocity = 2,
    gap = 120,
    baseYPosition = -174,
    zoom = 3,
  ) {
    this.imageTopX = imageTopX;
    this.imageTopY = imageTopY;
    this.imageBottomX = imageBottomX;
    this.imageBottomY = imageBottomY;
    this.imageTopWidth = imageTopWidth;
    this.imageTopHeight = imageTopHeight;
    this.imageBottomWidth = imageBottomWidth;
    this.imageBottomHeight = imageBottomHeight;
    this.xVelocity = xVelocity;
    this.gap = gap;
    this.baseYPosition = baseYPosition;
    this.pipePosition = new Array();
    this.zoom = zoom;
  }
  draw() {
    this.pipePosition.forEach((pipe) => {
      const topYposition = pipe.y;
      const bottomYposition =
        pipe.y + this.imageTopHeight * this.zoom + this.gap;
      context.drawImage(
        sprite,
        this.imageTopX,
        this.imageTopY,
        this.imageTopWidth,
        this.imageTopHeight,
        pipe.x,
        topYposition,
        this.imageTopWidth,
        this.imageTopHeight * this.zoom,
      );
      context.drawImage(
        sprite,
        this.imageBottomX,
        this.imageBottomY,
        this.imageBottomWidth,
        this.imageBottomHeight,
        pipe.x,
        bottomYposition,
        this.imageBottomWidth,
        this.imageBottomHeight * this.zoom,
      );
    });
  }
  update() {
    //   if (pipe.x < -50) {
    //     this.pipePosition.shift();
    //   }
    //   pipe.x -= this.xVelocity;

    // for (let i = 0; i < this.pipePosition.length; i++) {
    //   let pipe = this.pipePosition[i];

    //   const pipeLeft = pipe.x;
    //   const pipeRight = pipe.x + pipeWidth;

    //   const isInsidePipe = birdRight >= pipeLeft && birdLeft <= pipeRight;

    //   if (isInsidePipe) {
    //     const topPipeBottom = pipe.y + this.imageTopHeight * this.zoom;
    //     const bottomPipeTop = topPipeBottom + this.gap;

    //     const isHitTopPipe = birdTop <= topPipeBottom;
    //     const isHitBottomPipe = birdBottom >= bottomPipeTop;

    //     if (isHitTopPipe || isHitBottomPipe) {
    //       gameStates.current = gameStates.gameOver;
    //       break;
    //     }
    //   }
    // }

    if (frames % 100 === 0) {
      this.pipePosition.push({
        x: canvas.width,
        y: this.baseYPosition * (Math.random() + 1),
      });
    }
    const pipeWidth = this.imageTopWidth;
    const birdWidth = bird.imageWidth * bird.zoom * bird.birdHitScale;
    const birdHeight = bird.imageHeight * bird.zoom * bird.birdHitScale;
    const birdLeft = bird.canvasX - birdWidth / 2;
    const birdRight = bird.canvasX + birdWidth / 2;
    const birdTop = bird.canvasY - birdHeight / 2;
    const birdBottom = bird.canvasY + birdHeight / 2;

    this.pipePosition.forEach((pipe) => {
      pipe.x -= this.xVelocity;
    });

    this.pipePosition.some((pipe) => {
      const pipeLeft = pipe.x;
      const pipeRight = pipe.x + pipeWidth;
      const isInsidePipe = birdLeft <= pipeRight && birdRight >= pipeLeft;
      if (isInsidePipe) {
        const topPipeBottom = pipe.y + this.imageTopHeight * this.zoom;
        const isHitTopPipe = birdTop <= topPipeBottom;

        const bottomPipeTop =
          pipe.y + this.imageTopHeight * this.zoom + this.gap;
        const isHitBottomPipe = birdBottom >= bottomPipeTop;

        if (isHitTopPipe || isHitBottomPipe) {
          triggerGameOver();
        }
      }
    });

    if (this.pipePosition.length > 0 && this.pipePosition[0].x < -50) {
      this.pipePosition.shift();
      score.currenValue += 1;
      score.best = Math.max(score.best, score.currenValue);
      localStorage.setItem("bestScore", score.best);
      point.play();
    }
    this.draw();
  }
}

class GetReady {
  constructor(
    imageX = 146,
    imageY = 221,
    imageWidth = 87,
    imageHeight = 22,
    canvasX = canvas.width / 2,
    canvasY = canvas.height / 2,
    zoom = 2,
  ) {
    this.imageX = imageX;
    this.imageY = imageY;
    this.imageWidth = imageWidth;
    this.imageHeight = imageHeight;
    this.canvasX = canvasX;
    this.canvasY = canvasY;
    this.zoom = zoom;
  }
  draw() {
    const YPositionRegulator = 54;
    context.drawImage(
      sprite,
      this.imageX,
      this.imageY,
      this.imageWidth,
      this.imageHeight,
      this.canvasX - (this.imageWidth * this.zoom) / 2,
      this.canvasY - YPositionRegulator,
      this.imageWidth * this.zoom,
      this.imageHeight * this.zoom,
    );
  }
}

class StartButton {
  constructor(
    imageX = 242,
    imageY = 213,
    imageWidth = 40,
    imageHeight = 14,
    canvasX = canvas.width / 2,
    canvasY = canvas.height / 2,
    zoom = 2,
  ) {
    this.imageX = imageX;
    this.imageY = imageY;
    this.imageWidth = imageWidth;
    this.imageHeight = imageHeight;
    this.canvasX = canvasX;
    this.canvasY = canvasY;
    this.zoom = zoom;
  }
  draw() {
    const YPositionRegulator = 110;
    context.drawImage(
      sprite,
      this.imageX,
      this.imageY,
      this.imageWidth,
      this.imageHeight,
      this.canvasX - (this.imageWidth * this.zoom) / 2,
      this.canvasY + YPositionRegulator,
      this.imageWidth * this.zoom,
      this.imageHeight * this.zoom,
    );
  }
}

class Tap {
  constructor(
    imageX = 172,
    imageY = 122,
    imageWidth = 39,
    imageHeight = 49,
    canvasX = canvas.width / 2,
    canvasY = canvas.height / 2,
    zoom = 2,
  ) {
    this.imageX = imageX;
    this.imageY = imageY;
    this.imageWidth = imageWidth;
    this.imageHeight = imageHeight;
    this.canvasX = canvasX;
    this.canvasY = canvasY;
    this.spaceFromGetReady = 40;
    this.zoom = zoom;
  }
  draw() {
    const YPositionRegulator = 40;
    const XPositionRegulator = 10;
    context.drawImage(
      sprite,
      this.imageX,
      this.imageY,
      this.imageWidth,
      this.imageHeight,
      this.canvasX - (this.imageWidth * this.zoom) / 2 + XPositionRegulator,
      this.canvasY + this.spaceFromGetReady - YPositionRegulator,
      this.imageWidth * this.zoom,
      this.imageHeight * this.zoom,
    );
  }
}

class GameOver {
  constructor(
    imageX = 146,
    imageY = 199,
    imageWidth = 94,
    imageHeight = 19,
    canvasX = canvas.width / 2,
    canvasY = canvas.height / 2,
    zoom = 2,
  ) {
    this.imageX = imageX;
    this.imageY = imageY;
    this.imageWidth = imageWidth;
    this.imageHeight = imageHeight;
    this.canvasX = canvasX;
    this.canvasY = canvasY;
    this.zoom = zoom;
  }
  draw() {
    const YPositionRegulator = 85;

    context.drawImage(
      sprite,
      this.imageX,
      this.imageY,
      this.imageWidth,
      this.imageHeight,
      this.canvasX - (this.imageWidth / 2) * this.zoom,
      this.canvasY - YPositionRegulator,
      this.imageWidth * this.zoom,
      this.imageHeight * this.zoom,
    );
  }
}

class Score {
  constructor(best = localStorage.getItem("bestScore"), currenValue = 0 || 0) {
    this.best = best;
    this.currenValue = currenValue;
  }
  draw() {
    const XPositionRegulator = 70;
    const YCurrentPositionRegulator = 22;
    const YBestPositionRegulator = 75;
    const XPositionInGameRegulator = 110;
    const YPositionInGameRegulator = 32;
    if (gameStates.current == gameStates.inGame) {
      context.lineWidth = 5;
      context.font = "25px IMPACT";
      context.strokeStyle = "#000000";
      context.fillStyle = "#ffffff";
      context.strokeText(
        `${this.currenValue}`,
        XPositionInGameRegulator,
        YPositionInGameRegulator,
      );
      context.fillText(
        `${this.currenValue}`,
        XPositionInGameRegulator,
        YPositionInGameRegulator,
      );
      context.stroke();
      context.fill();
    } else if (gameStates.current == gameStates.gameOver) {
      context.lineWidth = 5;
      context.font = "25px IMPACT";
      context.strokeStyle = "#000000";
      context.fillStyle = "#ffffff";
      context.strokeText(
        `${this.currenValue}`,
        canvas.width / 2 + XPositionRegulator,
        canvas.height / 2 + YCurrentPositionRegulator,
      );
      context.fillText(
        `${this.currenValue}`,
        canvas.width / 2 + XPositionRegulator,
        canvas.height / 2 + YCurrentPositionRegulator,
      );
      context.stroke();
      context.fill();
      context.strokeText(
        `${this.best}`,
        canvas.width / 2 + XPositionRegulator,
        canvas.height / 2 + YBestPositionRegulator,
      );
      context.fillText(
        `${this.best}`,
        canvas.width / 2 + XPositionRegulator,
        canvas.height / 2 + YBestPositionRegulator,
      );
      context.stroke();
      context.fill();
    }
  }

  update() {
    if (frames % 240 === 0) {
      score.currenValue += 1;
      score.best = Math.max(score.best, score.currenValue);
      localStorage.setItem("bestScore", score.best);
    }
    this.draw();
  }
}

class SideScoreShow {
  constructor(
    imageX = 244,
    imageY = 173,
    imageWidth = 40,
    imageHeight = 14,
    canvasX = 60,
    canvasY = 10,
    zoom = 2,
  ) {
    this.imageX = imageX;
    this.imageY = imageY;
    this.imageWidth = imageWidth;
    this.imageHeight = imageHeight;
    this.canvasX = canvasX;
    this.canvasY = canvasY;
    this.zoom = zoom;
  }
  draw() {
    const YPositionRegulator = 85;

    context.drawImage(
      sprite,
      this.imageX,
      this.imageY,
      this.imageWidth,
      this.imageHeight,
      this.canvasX - (this.imageWidth / 2) * this.zoom,
      this.canvasY,
      this.imageWidth * this.zoom,
      this.imageHeight * this.zoom,
    );
  }
}

class ScoreChart {
  constructor(
    imageX = 146,
    imageY = 58,
    imageWidth = 113,
    imageHeight = 58,
    canvasX = canvas.width / 2,
    canvasY = canvas.height / 2,
    zoom = 2.5,
  ) {
    this.imageX = imageX;
    this.imageY = imageY;
    this.imageWidth = imageWidth;
    this.imageHeight = imageHeight;
    this.canvasX = canvasX;
    this.canvasY = canvasY;
    this.zoom = zoom;
  }
  draw() {
    const spaceFromGameOver = 40;
    context.drawImage(
      sprite,
      this.imageX,
      this.imageY,
      this.imageWidth,
      this.imageHeight,
      this.canvasX - (this.imageWidth * this.zoom) / 2,
      this.canvasY - spaceFromGameOver,
      this.imageWidth * this.zoom,
      this.imageHeight * this.zoom,
    );
  }
}

const die = new Audio();
const hit = new Audio();
const point = new Audio();
const wing = new Audio();
const swooshing = new Audio();
die.src = "./audio/die.mp3";
hit.src = "./audio/hit.mp3";
point.src = "./audio/point.mp3";
wing.src = "./audio/wing.flac";
swooshing.src = "./audio/swooshing.mp3";

// let bird = n ew Bird();
let background = new Background();
let backgroundImage = new BackgroundImage();
let foreground = new Foreground();
let getReady = new GetReady();
let gameOver = new GameOver();
let tap = new Tap();
let scoreChart = new ScoreChart();
let startButton = new StartButton();
let pipes = new Pipes();
let sideScoreShow = new SideScoreShow();
let score = new Score();

function triggerGameOver() {
  if (gameStates.current !== gameStates.gameOver) {
    gameStates.current = gameStates.gameOver;
    hit.play();
    setTimeout(() => {
      die.play();
    }, 300);
  }
}

function clickHandler() {
  switch (gameStates.current) {
    case gameStates.getReady:
      swooshing.play();
      gameStates.current = gameStates.inGame;
      bird = new Bird();
      pipes = new Pipes();
      score.currenValue = 0;
      bird.yVelocity = -bird.jump * bird.airResistance;
      break;
    case gameStates.inGame:
      bird.rotation = -degree * 35;
      bird.yVelocity = -bird.jump * bird.airResistance;
      wing.currentTime = 0;
      wing.play();
      break;
    case gameStates.gameOver:
      gameStates.current = gameStates.getReady;
      break;
  }
}

window.addEventListener("keydown", (e) => {
  clickHandler();
  // if (e.code === "Space") {
  //   clickHandler();
  // }
});
window.addEventListener("click", clickHandler); // click logic

function animate() {
  //   context.clearRect(0, 0, canvas.width, canvas.height);
  background.draw(); // works like clearRect because in every frame this will get on all the other frames
  backgroundImage.draw();
  switch (gameStates.current) {
    case gameStates.getReady:
      foreground.draw();
      getReady.draw();
      tap.draw();
      break;
    case gameStates.inGame:
      bird.update();
      pipes.update();
      foreground.update();
      sideScoreShow.draw();
      score.draw();
      frames += 1;
      break;
    case gameStates.gameOver:
      pipes.draw();
      foreground.draw();
      bird.update();
      gameOver.draw();
      scoreChart.draw();
      score.draw();
      startButton.draw();
      break;
  }

  requestAnimationFrame(animate);
}

animate();

// drawImage() method in context has 9 parameters:

// context.drawImage(main _img, cutImageFromX, cutImageFromY, cutImageWidth, cutImageHeight, imgCoordinatesInCanvasX, imgCoordinatesInCanvasY , imgCoordinatesInCanvasWidth, imgCoordinatesInCanvasHeight)
