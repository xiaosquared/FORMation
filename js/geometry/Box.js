function Box(x, y, xWidth, yWidth, height, shapeDisplay) {
    this.x = x;
    this.y = y;
    this.xWidth = xWidth;
    this.yWidth = yWidth;
    this.height = height;
    this.shapeDisplay = shapeDisplay;
    this.visible = true;
}

Box.prototype.draw = function() {
    for (var i = 0; i < this.xWidth; i++) {
      for (var j = 0; j < this.yWidth; j++) {
      	this.shapeDisplay.setPinHeight(~~(this.x + i), ~~(this.y + j), this.height);
      }
    }
}

Box.prototype.erase = function() {
	for (var i = 0; i < this.xWidth; i++) {
      for (var j = 0; j < this.yWidth; j++) {
      	this.shapeDisplay.setPinHeight(~~(this.x + i), ~~(this.y + j), 0);
      }
    }
}

Box.prototype.destroy = function() {
  if (this.visible) {
    this.erase();
    this.visible = false;
  }
}

Box.prototype.move = function(moveX, moveY) {
  if (this.visible) {
    this.erase();
    this.changePos(moveX, moveY);
    this.draw();
  }
}

Box.prototype.changePos = function(deltaX, deltaY) {
	this.x += deltaX;
	this.y += deltaY;
}

Box.prototype.collides = function(otherBox) {
  if (!otherBox.visible) return false;
	return (Math.abs(~~this.x - ~~otherBox.x) * 2 <= ~~(this.xWidth + otherBox.xWidth) && Math.abs(~~this.y - ~~otherBox.y) * 2 <= ~~(this.yWidth + otherBox.yWidth));
}
