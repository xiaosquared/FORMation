/*
***PONG!***
*/
//global vars and controls here
var paddle = xForm.makeBox(0, 0, 5, 1, 1.0);
var leftBound = 0;
var rightBound = xForm.x_size;
var paddleSpeed = 0.2;
paddle.draw();

var playerPaddle = xForm.makeBox(10, 23, 5, 1, 1.0);
var playerPaddleSpeed = 0.2;
playerPaddle.draw();

var bullet = xForm.makeBox(12, 15, 5, 5, 0.5);
bullet.makeHollow();
var bulletXSpeed = 0.08;
var bulletYSpeed = -0.1;

window.addEventListener('keydown', function(e) {
  switch(e.keyCode) {
    case 100:
    case 37:
    	playerPaddleSpeed = -0.2;
    break;
    case 102:
    case 39:
        playerPaddleSpeed = 0.2;
    break;
  }
});

//this function will be executed with each frame
return function () {
  xForm.clearDisplay(0.5);
  //simple AI for computer
  if (paddle.x <= bullet.x) {
    paddleSpeed = Math.random() * 0.1 + 0.08;
  }
  else if (paddle.x + paddle.x_size >= bullet.x + bullet.x_size) {
    paddleSpeed = Math.random() * -0.1 - 0.08;
  }
  else {
    paddleSpeed = 0;
  }
  //keep player paddle in bounds
  if (playerPaddle.x > rightBound - playerPaddle.x_size) {
    playerPaddleSpeed = 0;
    playerPaddle.x = rightBound - playerPaddle.x_size;
  }
  if (playerPaddle.x < leftBound) {
    playerPaddleSpeed = 0;
    playerPaddle.x = leftBound
  }
  //bounce bullet
  if (bullet.x > rightBound-bullet.x_size || bullet.x < leftBound) {
    bulletXSpeed = -bulletXSpeed;
  }
  if (bullet.y > xForm.y_size - bullet.y_size + 1 || bullet.y < 1 - 1) {
    bullet.destroy();
    bullet.x = 12.5;
  }
  //bullet collision
  if ((bullet.collides(paddle, 1) && bulletYSpeed < 0) || (bullet.collides(playerPaddle, -1) && bulletYSpeed > 0)) {
    bulletYSpeed = -bulletYSpeed;
    if (Math.abs(bulletYSpeed < 0.2)) {
      if (bulletYSpeed < 0) {
        bulletYSpeed -= 0.005;
      }
      else bulletYSpeed += 0.005;
    }
    if (bulletXSpeed > 0) {
      bulletXSpeed = Math.random(0) * 0.2;
    }
    else {
      bulletXSpeed = Math.random(0) * -0.2;
    }
  }
  //update paddle, playerPaddle and bullet with each frame
  bullet.move(bulletXSpeed, bulletYSpeed);
  paddle.move(paddleSpeed,0);
  playerPaddle.move(playerPaddleSpeed, 0)
};
