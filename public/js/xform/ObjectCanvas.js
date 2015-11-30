var planeSize = 24;

var pin=new2DArray(planeSize,planeSize);
var canvas;
var ctx;

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

function createFromArr (width, height) {
    return new ObjectOnShapeDisplay("Picture",width, height, pin);
}


function draw() {

	var img = new Image();
	img.src = 'snowflex.jpg';
    canvas = document.getElementById('canvas');
    //var canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

	img.onload = function() {

  		ctx.drawImage(img, 0, 0);
  		img.style.display = 'none';

  		var pinSize = 24;


  		var color = document.getElementById('color');
		  var pixel = ctx.getImageData(0, 0, img.width, img.height);
  		var data = pixel.data;

  		//console.log(data);
  		var rgb=[];
  		var i;	var j;	var x;	var y;
    for ( i = 0; i < img.width ; i++) {
       rgb[i]=[];
    }

    i = 0;

    for ( x = 0; x < img.width; x++) {
      for ( y = 0; y < img.height; y++){
      	if ( data[i]+data[i+1]+data[i+2] < 600 ){
            rgb[x][y] = 1;
        }
        else
        	rgb[x][y] = 0;
        i += 4;
     	}
    }

    var w = Math.floor(img.width/pinSize);
    var h = Math.floor(img.height/pinSize);
  	for ( i = 0 ; i < pinSize; i++ ) {
      for ( j = 0 ; j < pinSize; j++ ) {

			var sumRGB = 0;
                for ( x = 0 ; x < w; x++ ) {
					for ( y = 0 ; y < h; y++ ) {
						if ( rgb[i*w+x][j*h+y] == 1){
							sumRGB++;
							//console.log(i+x,j+y);
						}
					}
				}
				//console.log(i,j,sumRGB);
				if ( sumRGB > 0.7*(w*h) )
					pin[i][j] = 1;
  			
  			}
  		}

	};



}


/*
var a = createFromArr(24,24);
    a.setLocation(12,12);
    a.addToShapeDisplay();
*/