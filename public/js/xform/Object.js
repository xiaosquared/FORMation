var planeSize = 24;

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


function ObjectOnShapeDisplay(type, xSize, ySize, arrayOfObject) {

    this.xSize = xSize;
    this.ySize = ySize;
    this.h = new2DArray(xSize,ySize);
    this.center = {x: xSize/2, y: ySize/2};
    this.vector = {x: xSize/2, y: ySize/2};
    this.type = type;               // Type of shape Ex.Circle, Rectangle, ...
    this.location = {x: 0, y: 0}    // Location on plane
    this.plane = new2DArray(planeSize,planeSize);

    for (var x = 0; x < this.xSize; x++ ){
        for( var y = 0; y < this.ySize; y++ ){
            this.h[x][y] = arrayOfObject[x][y];
        }
    }
}

ObjectOnShapeDisplay.prototype.addToShapeDisplay = function() {
    // Set pin height of object to shape display
    for (var x = 0; x < planeSize; x++ ) {
        for( var y = 0; y < planeSize; y++ ) {
            xForm.setPinHeight(x,y,this.plane[x][y]);
        }
    }
}

ObjectOnShapeDisplay.prototype.updatePlaneFromObject = function() {
    // Update plane based on object shape and its location
    for (var x = 0; x < planeSize; x++ ) {
        for( var y = 0; y < planeSize; y++ ) {
            this.plane[x][y] = 0;
        }
    }
    for ( x = 0; x < this.xSize; x++ ) {
        for( y = 0; y < this.ySize; y++ ) {
            this.plane[Math.floor(this.location.x+x-this.center.x)][Math.floor(this.location.y+y-this.center.y)] = this.h[x][y];
        }
    }
}

ObjectOnShapeDisplay.prototype.updateObjectFromPlane = function() {
    // Update object based on plane

    this.h = new2DArray(planeSize,planeSize);
    this.xSize = planeSize;
    this.ySize = planeSize;

    // Copy Array to update object
    for (var x = 0; x < planeSize; x++ ) {
        for( var y = 0; y < planeSize; y++ ) {
            this.h[x][y] = this.plane[x][y];
        }
    }
    this.clearWhiteArea();
    this.findCenter();

}


ObjectOnShapeDisplay.prototype.setLocation = function(x0,y0) {
    // set the location of object -> the location is coordinate of ShapeDisplay where the center of object will be located
    this.location.x = x0;
    this.location.y = y0;
    this.updatePlaneFromObject();
}

ObjectOnShapeDisplay.prototype.add = function(obj) {

    // Add the "obj" to "this" : "this" will be changed after operation
    for (var x = 0; x < planeSize; x++ ) {
        for( var y = 0; y < planeSize; y++ ) {
            if (obj.plane[x][y]!=0){
                this.plane[x][y] = obj.plane[x][y];
            }
        }
    }
    this.updateObjectFromPlane();
}

ObjectOnShapeDisplay.prototype.subtract = function(obj) {

    // Subtract the "obj" from "this" : "this" will be changed after operation
    for (var x = 0; x < planeSize; x++ ) {
        for( var y = 0; y < planeSize; y++ ) {
            if ( this.plane[x][y]!=0 && obj.plane[x][y]!=0){
                this.plane[x][y] = 0;
            }
        }
    }
    this.updateObjectFromPlane();
}

ObjectOnShapeDisplay.prototype.clearWhiteArea = function() {

    // Clear white space around the object to make sure that the xSize and ySize of object is accurate

    var X = {st: -1, en: -1};
    var Y = {st: -1, en: -1};

    for ( var x = 0; x < this.xSize; x++ ) {
        for ( var y = 0; y < this.ySize; y++ ) {
            if ( this.h[x][y]!=0 ) {
                X.st = x;
                break;
            }
        }
        if ( X.st!=-1 ) {
            break;
        }
    }


    for ( y = 0; y < this.ySize; y++ ) {
        for ( x = 0; x < this.xSize; x++ ) {
            if ( this.h[x][y]!=0 ) {
                Y.st = y;
                break;
            }
        }
        if ( Y.st!=-1 ) {
            break;
        }
    }

    for ( x = this.xSize-1; x >= 0; x-- ) {
        for ( y = this.ySize-1; y >= 0 ; y-- ) {
            if ( this.h[x][y]!=0 ) {
                X.en = x;
                break;
            }
        }
        if ( X.en!=-1 ) {
            break;
        }
    }

    for ( y = this.ySize-1; y >= 0; y-- ) {
        for ( x = this.xSize-1; x >= 0 ; x-- ) {
            if ( this.h[x][y]!=0 ) {
                Y.en = y;
                break;
            }
        }
        if ( Y.en!=-1 ) {
            break;
        }
    }

    var size = { x: X.en-X.st+1 , y: Y.en-Y.st+1 };
    newH = new2DArray(size.x,size.y);
    for ( var x = 0; x < size.x; x++ ) {
        for ( var y = 0; y < size.y; y++ ) {
            newH[x][y] = this.h[x+X.st][y+Y.st];
        }
    }
    for ( var x = 0; x < size.x; x++ ) {
        for ( var y = 0; y < size.y; y++ ) {
            this.h[x][y] = newH[x][y]
        }
    }
    this.xSize = size.x;
    this.ySize = size.y;
    this.updatePlaneFromObject();

}

ObjectOnShapeDisplay.prototype.findCenter = function() {

    // Find center of mass of the object
    var xWeight = 0; // Weight by position of coordinate
    var yWeight = 0;
    this.clearWhiteArea();

    for (var x = 0; x < this.xSize; x++ ) {
        for( var y = 0; y < this.ySize; y++ ) {
            if ( this.h[x][y] != 0 ) {
                xWeight += x;
                yWeight += y;
            }
        }
    }

    this.center.x = xWeight/this.xSize;
    this.center.y = yWeight/this.ySize;
}

function createRectangle (width, height) {

    var h = new2DArray(width,height);
    for ( var j = 0; j < width; j++ ) {
        for ( var k = 0; k < height ; k++) {
            h[j][k] = 1;
        }
    }
    return new ObjectOnShapeDisplay("Rectangle",width, height, h);
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
    return new ObjectOnShapeDisplay("LineCircle",2*r+1, 2*r+1, h);
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
    return new ObjectOnShapeDisplay("Circle",2*r+1, 2*r+1, h);
}


/* ====== Test Code for editor ======

    var circle = createCircle(8);
    circle.setLocation(15,15);

    var rec = createRectangle(7,5);
    rec.setLocation(15,15);
    circle.subtract(rec);
    circle.addToShapeDisplay();

XX: Some tests for robustness

1. --------------------------
var circle = createCircle(5);
    circle.setLocation(15,15);
var rec = createRectangle(7,5);
    rec.setLocation(10,15);

circle.addToShapeDisplay();
rec.addToShapeDisplay();

This one only shows rec, not circle
Ideal behavior: show both if they don't overlap.
If they do overlap, automatically do boolean add operation
----------------------------

2.--------------------------
var rec = createRectangle(2,2);
    rec.setLocation(0,15);

rec.addToShapeDisplay();

When the shape partly extends beyond the shape display, it doesn't show up at all
Ideal behavior: the part that stays on the shape display should show up
----------------------------
*/
