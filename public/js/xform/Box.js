function Box(x, y, x_size, y_size, height, shapeDisplay) {
    this.x = x;
    this.y = y;
    this.x_size = x_size;
    this.y_size = y_size;
    this.shapeDisplay = shapeDisplay;
    this.height = height + shapeDisplay.defaultPinHeight;
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
    //keep box from overflowing shapeDisplay bounds
    var xSum = (this.x + this.x_size);
    var xMax = xSum >= this.shapeDisplay.x_size ? this.shapeDisplay.x_size : xSum;
    var ySum = (this.y + this.y_size);
    var yMax = ySum >= this.shapeDisplay.y_size ? this.shapeDisplay.y_size : ySum;
    console.log("xMax "+ xMax);
    console.log("yMax "+ yMax);
    for (var i = this.x; i < xMax; i++) {
      for (var j = this.y; j < yMax; j++) {
        if (!this.hollow) {
            this.shapeDisplay.setPinHeight(~~(i), ~~(j), this.height);
        }
        else {
            //TODO double check new logic
            var distFromBorder = Math.min(i - this.x,(xMax - i), j - this.y, (yMax - j));
            this.shapeDisplay.setPinHeight(~~(i), ~~(j), this.height - (distFromBorder + 1) * 0.1);
        }
      }
    }
}

Box.prototype.erase = function(h) {
    h = h ? h : this.shapeDisplay.defaultPinHeight;
    var xSum = (this.x + this.x_size);
    var xMax = xSum >= this.shapeDisplay.x_size ? this.shapeDisplay.x_size : xSum;
    var ySum = (this.y + this.y_size);
    var yMax = ySum >= this.shapeDisplay.y_size ? this.shapeDisplay.y_size : ySum;
    for (var i = this.x; i < xMax; i++) {
      for (var j = this.y; j < yMax; j++) {
      	this.shapeDisplay.setPinHeight(~~(i), ~~(j), h);
      }
    }
}

Box.prototype.destroy = function(h) {
    h = h ? h : this.shapeDisplay.defaultPinHeight;
    if (this.visible) {
        this.erase(h);
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

function new2DArray(xSize, ySize){
         // Create and init 2D array

         var arr=[];
         for (var i = 0; i < xSize ; i++) {
             arr[i]=[];
         }
         for (var x = 0; x < xSize; x++) {
             for (var y = 0; y < ySize; y++){
                 arr[x][y] = 0;
             }
         }
         return arr;
    }


function ObjectOnShapeDisplay(xSize, ySize, arrayOfObject) {
    this.xSize = xSize;
    this.ySize = ySize;
    this.h = new2DArray(xSize,ySize);

    for (var x = 0; x < this.xSize; x++ ){
        for( var y = 0; y < this.ySize; y++ ){
            this.h[x][y] = arrayOfObject[x][y];
        }
    }
}

ObjectOnShapeDisplay.prototype.addToShapeDisplay = function() {
    for (var x = 0; x < this.xSize; x++ ) {
        for( var y = 0; y < this.ySize; y++ ) {
            xForm.setPinHeight(x,y,this.h[x][y]);
        }
    }
}


ObjectOnShapeDisplay.prototype.addToShapeDisplay = function(x0,y0) {
    for (var x = 0; x < this.xSize; x++ ) {
        for( var y = 0; y < this.ySize; y++ ) {
            xForm.setPinHeight(x0+x,y0+y,this.h[x][y]);
        }
    }
}

function createRectangle (width, height) {
    var h = new2DArray(width,height);
    for ( var j = 0; j < width; j++ ) {
        for ( var k = 0; k < height ; k++) {
            h[j][k] = 1;
        }
    }
    return new ObjectOnShapeDisplay(width, height, h);
}

function createLineCircle (r) {
    var h = new2DArray(2*r+1,2*r+1);
    var x0 = r+1;
    var y0 = r+1;
    for ( var x = 0; x < r; x++ ) {
        var y = Math.floor(Math.sqrt(Math.pow(r,2)-Math.pow(x,2)));
        h[x0+x][y0+y] = 1;
        h[x0+x][y0-y] = 1;
        h[x0-x][y0+y] = 1;
        h[x0-x][y0-y] = 1;
    }
    return new ObjectOnShapeDisplay(2*r+1, 2*r+1, h);
}
function createCircle (r) {
    var h = new2DArray(2*r+1,2*r+1);
    var x0 = r+1;
    var y0 = r+1;
    for ( var x = 0; x < r; x++ ) {
        var yMax = Math.floor(Math.sqrt(Math.pow(r,2)-Math.pow(x,2)));
        var yMin = -yMax;
        for ( var y = yMin; y < yMax; y++ ) {
            h[x0+x][y0+y] = 1;
            h[x0-x][y0+y] = 1;
        }
    }
    return new ObjectOnShapeDisplay(2*r+1, 2*r+1, h);
}
