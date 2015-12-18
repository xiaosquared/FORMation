var planeSize = 24;

var pin = new2DArray(planeSize,planeSize);
var pinCorrected = new2DArray(planeSize,planeSize);
var canvas;
var ctx;
var rgb;
var pinSize;
var dataRGBA;

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


ObjectOnShapeDisplay.prototype.setLocation = function(x0,y0) {
    // set the location of object -> the location is coordinate of ShapeDisplay where the center of object will be located 
    this.location.x = x0;
    this.location.y = y0;
    this.updatePlaneFromObject();
}

function createFromArr (width, height) {
    convertPinHeight();
    return new ObjectOnShapeDisplay("Picture",width, height, pinCorrected);
}


function addImg(filePath){

    
    var img = new Image();
    img.src = filePath;
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.fillRect(0,0,500,500);

    img.onload = function() {

        ctx.drawImage(img, 0, 0);
        img.style.display = 'none';
        drawCanvas();
        //window.setTimeout(draw,1000);
    }
}

function initCanvas(){

    // Set Canvas as a White Area

    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.fillRect(0,0,500,500);
    pinSize = 24;
    
    var img = new Image();
    img.src = canvas.toDataURL();
    
    rgb = new2DArray(img.width,img.height);
    
}

function drawCanvas() {

    var img = new Image();
    img.src = canvas.toDataURL();

    ctx.fillStyle = "rgb(255,255,255)";
    ctx.fillRect(0,0,500,500);

	img.onload = function() {

  		ctx.drawImage(img, 0, 0);
  		img.style.display = 'none';

		var pixel = ctx.getImageData(0, 0, img.width, img.height);
  		dataRGBA = pixel.data;

  		//setBlackAndWhiteForEachPixel();
        //setPinFromCanvas();
        setGrayForEachPixel();
        setGreyPinFromCanvas();

        //window.setTimeout(updateShapeDisplay,1000);
	};

}


function setBlackAndWhiteForEachPixel() {
    
    var img = new Image();
    img.src = canvas.toDataURL();
    var i;  var j;  var x;  var y;
    
    i = 0; // i is iterator of color RGB pointer

    // Search Black and White from Each Pixel
    for ( x = 0; x < img.width; x++) {
        for ( y = 0; y < img.height; y++){
            if ( dataRGBA[i]+dataRGBA[i+1]+dataRGBA[i+2] < 600 ){
                rgb[x][y] = 1; //Black
            }
            else
               rgb[x][y] = 0; //White
            i += 4;
        }
    }

}

function setGrayForEachPixel() {
    
    var img = new Image();
    img.src = canvas.toDataURL();
    var i;  var j;  var x;  var y;
    
    i = 0; // i is iterator of color RGB pointer

    // Search Black and White from Each Pixel
    for ( x = 0; x < img.width; x++) {
        for ( y = 0; y < img.height; y++){
            rgb[x][y] = 1-(dataRGBA[i]+dataRGBA[i+1]+dataRGBA[i+2])/765;
            i += 4;
        }
    }

}


function setPinFromCanvas() {
    // Convert pixel of Canvas into new array size 24x24

    var img = new Image();
    img.src = canvas.toDataURL();

    var w = Math.floor(img.width/pinSize);
    var h = Math.floor(img.height/pinSize);
    for ( var i = 0 ; i < pinSize; i++ ) {
        for ( var j = 0 ; j < pinSize; j++ ) {
            var sumRGB = 0;
                for ( var x = 0 ; x < w; x++ ) {
                    for ( var y = 0 ; y < h; y++ ) {
                        if ( rgb[i*w+x][j*h+y] == 1)
                            sumRGB++;
                    }
                }
            if ( sumRGB > 0.7*(w*h) )
                pin[i][j] = 1;
            else
                pin[i][j] = 0;
        }
    }
    updateShapeDisplay();
}


function setGreyPinFromCanvas() {
    // Convert pixel of Canvas into new array size 24x24

    var img = new Image();
    img.src = canvas.toDataURL();

    var w = Math.floor(img.width/pinSize);
    var h = Math.floor(img.height/pinSize);

    for ( var i = 0 ; i < pinSize; i++ ) {
        for ( var j = 0 ; j < pinSize; j++ ) {
            var sumRGB = 0;
            for ( var x = 0 ; x < w; x++ ) {
                for ( var y = 0 ; y < h; y++ ) {
                    sumRGB+=rgb[i*w+x][j*h+y];
                }
            }
            pin[i][j] = sumRGB/(w*h);
        }
    }
    updateShapeDisplay();
}


function updateShapeDisplay(){
    var a = createFromArr(24,24);
    a.setLocation(12,12);
    a.addToShapeDisplay();
}


function addLetter(letter) {

    // Draw one letter on Canvas using text drawing function of canvas

    ctx.fillStyle = "rgb(255,255,255)";
    ctx.fillRect(0,0,500,500);
    

    ctx.fillStyle = "rgb(0,0,0)";
    ctx.font = "bolder 280px Arial";
    ctx.fillText(letter, 20, 250);
    drawCanvas();
    //window.setTimeout(drawCanvas,00);

}

function convertPinHeight() {

    // Convert the array of pin to fix the problem of invert and rotated picture

    for ( var i = 0 ; i < pinSize; i++ ) {
        for ( var j = 0 ; j < pinSize; j++ ) {
            pinCorrected[j][i] = pin[i][j];
        }
    }

}

function isTyping() {

    // Realtime display what alphabet you type on your keyboard

    window.addEventListener("keydown", checkKeyPressed, false);
 
    function checkKeyPressed(e) {
        //alert(e.keyCode);
        if (parseInt(e.keyCode) >= 65 && parseInt(e.keyCode) <= 90 ) {
            addLetter( String.fromCharCode(parseInt(e.keyCode)) );
        }
    }
}
/*

    Test Case
    ///////1/////
    addImg('img/snowflex.jpg');
    return function () {

    };
    
    //////2//////
    isTyping();
    return function () {

    };

*/
