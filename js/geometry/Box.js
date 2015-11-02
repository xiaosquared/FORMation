function Box(x, y, xWidth, yWidth, height, shapeDisplay) {
    this.x = x;
    this.y = y;
    this.xWidth = xWidth;
    this.yWidth = yWidth;
    this.height = height;
    this.shapeDisplay = shapeDisplay;
    this.visible = true;
    this.hollow = false;
}

Box.prototype.makeHollow = function() {
    this.hollow = true;
}

Box.prototype.draw = function() {
    for (var i = 0; i < this.xWidth; i++) {
      for (var j = 0; j < this.yWidth; j++) {
        if (!this.hollow) {
            this.shapeDisplay.setPinHeight(~~(this.x + i), ~~(this.y + j), this.height);
        }
        else {
            var distFromBorder = Math.min(i,(this.xWidth - 1 - i), j, (this.yWidth - 1 - j));
            this.shapeDisplay.setPinHeight(~~(this.x + i), ~~(this.y + j), this.height - (distFromBorder + 1) * 0.1);
        }
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


Box.prototype.collides = function(otherBox, yExtra) {
  if (!otherBox.visible) return false;
  if (!yExtra) {
      yExtra = 0;
  }
  ty1 = ~~(this.y);
  ty2 = ~~(this.y + this.yWidth);
  oy1 = ~~(otherBox.y);
  oy2 = ~~(otherBox.y + otherBox.yWidth);
  tx1 = ~~(this.x);
  tx2 = ~~(this.x + this.xWidth);
  ox1 = ~~(otherBox.x);
  ox2 = ~~(otherBox.x + otherBox.xWidth);
  return (((ox1 <= tx1 && tx1 <= ox2) || (ox1 <= tx2 && tx2 <= ox2)) && ((oy1 <= (ty1 + yExtra) && (ty1 + yExtra) <= oy2) || (oy1 <= (ty2 + yExtra) && (ty2 + yExtra) <= oy2)));
}
