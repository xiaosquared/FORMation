//add global variables here:
var i = 0;

//this function will be executed with each frame
return function () {
  i += 0.075;

  for (var j = 0; j < 24; j++) {
    for (var k = 0; k < 24; k++) {
      xForm.setPinHeight(j,k,0.5 + 0.5 * Math.cos(i + j * 0.5));
    }
  }
};

//add global variables here:
var i = 0;
var centerX = 12;
var centerY = 12;
var sqrt = [];
for (var x = 0; x < 24; x++) {
  for (var y = 0; y < 24; y++) {
    sqrt[x*24 + y] = Math.sqrt( (centerX-x)*(centerX-x) + (centerY-y)*(centerY-y) );
  }
}

//this function will be executed with each frame
return function () {
  i += 0.02;
  var phase = 2 * Math.PI * i;

  for (var x = 0; x < 24; x++) {
    for (var y = 0; y < 24; y++) {
      var d = sqrt[x*24 + y];
      var height = Math.sin(d- phase) / d;
      xForm.setPinHeight(x, y, height);
    }
  }
};


/***************************
****** TOUCH HANDLING ******
****************************/
//global variables are defined here
var i = 0;
var centerX = xForm.x_size / 2;
var centerY = xForm.y_size / 2;

//this function will be exectued with each frame
return function() {
    i += 0.02;
    var phase = 2 * Math.PI * i;

    var coords = xForm.getTouchedPin();
    if (coords) {
      centerX = coords[0];
      centerY = coords[1];   
    }

    for (var x = 0; x < xForm.x_size; x++) {
        for (var y = 0; y < xForm.y_size; y++) {
          var d = Math.sqrt((centerX-x)*(centerX-x) + (centerY-y)*(centerY-y));
          var height = Math.sin(d - phase) / d;
          xForm.setPinHeight(x, y, height + 0.4);
        }
    }
}
