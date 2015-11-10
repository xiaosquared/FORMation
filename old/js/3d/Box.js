function Box(x, y, x_size, y_size, height, shapeDisplay) {
    this.x = x;
    this.y = y;
    this.x_size = x_size;
    this.y_size = y_size;
    this.height = height;
    this.shapeDisplay = shapeDisplay;
    this.visible = true;
    this.hollow = false;
}

Box.prototype.makeHollow = function(hollow) {
    if (!hollow)
        this.hollow = true;
    else
        this.hollow = hollow;
}

Box.prototype.draw = function() {
    for (var i = 0; i < this.x_size; i++) {
      for (var j = 0; j < this.y_size; j++) {
        if (!this.hollow) {
            this.shapeDisplay.setPinHeight(~~(this.x + i), ~~(this.y + j), this.height);
        }
        else {
            var distFromBorder = Math.min(i,(this.x_size - 1 - i), j, (this.y_size - 1 - j));
            this.shapeDisplay.setPinHeight(~~(this.x + i), ~~(this.y + j), this.height - (distFromBorder + 1) * 0.1);
        }
      }
    }
}

Box.prototype.erase = function(h) {
    h = h ? h : 0;
	for (var i = 0; i < this.x_size; i++) {
      for (var j = 0; j < this.y_size; j++) {
      	this.shapeDisplay.setPinHeight(~~(this.x + i), ~~(this.y + j), 0);
      }
    }
}

Box.prototype.destroy = function(h) {
    h = h ? h : 0;
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
  ty2 = ~~(this.y + this.y_size);
  oy1 = ~~(otherBox.y);
  oy2 = ~~(otherBox.y + otherBox.y_size);
  tx1 = ~~(this.x);
  tx2 = ~~(this.x + this.x_size);
  ox1 = ~~(otherBox.x);
  ox2 = ~~(otherBox.x + otherBox.x_size);
  return (((ox1 <= tx1 && tx1 <= ox2) || (ox1 <= tx2 && tx2 <= ox2)) && ((oy1 <= (ty1 + yExtra) && (ty1 + yExtra) <= oy2) || (oy1 <= (ty2 + yExtra) && (ty2 + yExtra) <= oy2)));
}
