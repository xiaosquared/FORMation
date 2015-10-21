function Box(x, y, xWidth, yWidth, height, shapeDisplay) {
    this.x = x;
    this.y = y;
    this.xWidth = xWidth;
    this.yWidth = yWidth;
    this.height = height;
    this.shapeDisplay = shapeDisplay;
}

Box.prototype.drawBox = function() {
    for (var i = 0; i < this.xWidth; i++) {
      for (var j = 0; j < this.yWidth; j++) {
      	this.shapeDisplay.setPinHeight(Math.floor(this.x + i), Math.floor(this.y + j), this.height);
      }
    }
}

Box.prototype.deleteBox = function() {
	for (var i = 0; i < this.xWidth; i++) {
      for (var j = 0; j < this.yWidth; j++) {
      	this.shapeDisplay.setPinHeight(Math.floor(this.x + i), Math.floor(this.y + j), 0);
      }
    }
}

Box.prototype.moveBox = function(moveX, moveY) {
    this.deleteBox();
    this.changePos(moveX, moveY);
    this.drawBox();
}

Box.prototype.changePos = function(deltaX, deltaY) {
	this.x += deltaX;
	this.y += deltaY;
}

Box.prototype.collides = function(otherBox) {
	return (this.x > otherBox.x && this.x < otherBox.x + otherBox.xWidth && this.y > otherBox.y && this.y < otherBox.y + otherBox.yWidth);
}
