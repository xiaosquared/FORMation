var materials = (function() {
    var m = {};
    var pinBlack = THREE.ImageUtils.loadTexture('textures/darkPinTexture.jpg');
    m.wallMaterial = new THREE.MeshPhongMaterial( { color: 0xeeeeee, shading: THREE.SmoothShading } );
    m.clearMaterial = new THREE.MeshPhongMaterial( { color: 0xeeeeee, shading: THREE.SmoothShading, transparent: true, opacity: 0.3 } );
    m.whiteMaterial = new THREE.MeshLambertMaterial( { color: 0xffffff, map: pinBlack } );
    m.darkMaterial = new THREE.MeshLambertMaterial( { color: 0x333333, map: pinBlack } );
    m.touchMaterial = new THREE.MeshLambertMaterial( {color: 0xdd1111 });

    m.shadowMaterial = new THREE.MeshPhongMaterial( {color: 0x666666, shading: THREE.SmoothShading });
    m.shadowClearMaterial = new THREE.MeshPhongMaterial( {color: 0x666666, shading: THREE.SmoothShading, transparent:true, opacity: 0.3 });

    m.ghostMaterial = new THREE.MeshBasicMaterial({color: 0x999999, transparent: true, opacity: 0.5});
    return m;
})();

function ShapeDisplay(x_size, y_size, height, scene) {
    this.pinSize = 1.0;
    this.inBetween = 0.;
    this.x_size = x_size;
    this.y_size = y_size;
    this.totalWidthAcross = (this.pinSize + this.inBetween) * this.x_size;
    this.totalWidthDown = (this.pinSize + this.inBetween) * this.y_size;
    this.height = height;

    //height that clearDisplay sets to
    this.defaultPinHeight = 0.5;

    this.pinLength =7;
    //keep track of touched pins
    this.touchedPins = {};

    this.container = new THREE.Mesh();
    this.pins = new Array(x_size * y_size);
    this.physicalPinHeights = new Array(x_size * y_size);
    this.prevPhysicalPinHeights = new Array(x_size * y_size);

    for (var i = 0; i < x_size * y_size; i++) {
        var pin = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), materials.whiteMaterial.clone());
        pin.position.set(i% x_size * (this.pinSize + this.inBetween) + this.pinSize/2,
                        0, Math.floor(i/x_size) * (this.pinSize + this.inBetween) + this.pinSize/2);
        pin.scale.set(1, this.pinLength, 1);
        pin.pinIndex = i;
        this.container.add(pin);
        this.pins[i] = pin;
        this.physicalPinHeights[i] = 0;
        this.prevPhysicalPinHeights[i] = 0;
    }

    var bottom = new THREE.Mesh(new THREE.BoxGeometry(this.getTotalWidthAcross(), 0.75, this.getTotalWidthDown()), materials.darkMaterial);
    bottom.position.set(this.getTotalWidthAcross()/2, -this.pinLength/2-0.5, this.getTotalWidthDown()/2);
    this.container.add(bottom);

    if (scene)
        this.addToScene(scene);
    this.container.translateY(this.height - this.pinLength/2);
    this.container.rotateY(-Math.PI/2);
    this.container.position.set(this.getTotalWidthDown(), this.container.position.y, -this.getTotalWidthAcross()/2);
}
ShapeDisplay.prototype.getGeometry = function() {
    return this.container;
}
ShapeDisplay.prototype.getXSize = function() {
    return this.x_size;
}
ShapeDisplay.prototype.getYSize = function() {
    return this.y_size;
}
ShapeDisplay.prototype.getTotalWidthAcross = function() {
    return this.totalWidthAcross;
}
ShapeDisplay.prototype.getTotalWidthDown = function() {
    return this.totalWidthDown;
}
ShapeDisplay.prototype.addToScene = function(scene) {
    scene.add(this.container);
}
ShapeDisplay.prototype.getIndex = function(x, y) {
  return  y * this.x_size + x;
}
ShapeDisplay.prototype.getXYFromIndex = function(index) {
    return [~~(index % this.x_size), ~~(index / this.x_size)];
}
ShapeDisplay.prototype.getPosition = function() {
    return this.container.position;
}
ShapeDisplay.prototype.setPositionZ = function(z) {
    this.container.position.set(    this.container.position.x,
                                    this.container.position.y,
                                    z - this.getTotalWidthDown()/2);
}
ShapeDisplay.prototype.setPositionX = function(x) {
    this.container.position.set(    x + this.getTotalWidthAcross(),
                                    this.container.position.y,
                                    this.container.position.z);
}
ShapeDisplay.prototype.getPinPosition = function(x, y){
    var index = this.getIndex(x, y);
    if (index < this.pins.length)
        return this.pins[index].position;
    return null;
}
ShapeDisplay.prototype.getPinHeightForPhysical = function(x, y) {
    var index = this.getIndex(x, y);
    if (index < this.pins.length)
        return this.pins[index].position.y * 255 / this.pinLength;
    return null;
}
ShapeDisplay.prototype.getHeightsMsgForPhysical = function() {
    var msg = [];
    for (var i = 0; i < this.pins.length; i++) {
        msg.push(this.physicalPinHeights[i]);
    }
    return msg;
}
ShapeDisplay.prototype.setPinHeight = function(x, y, h) {
    if (h || (h == 0)) {
        var index = this.getIndex(x, y);
    } else {
        index = x;
        h = y;
    }
    if (index < this.pins.length) {
        h = (h > 1) ? 1 : h;
        h = (h < 0) ? 0 : h;
        this.pins[index].position.y = h * this.pinLength/2;
        this.physicalPinHeights[index] = Math.round(h * 255);
    }
}
ShapeDisplay.prototype.setPinHeightFromPhysical = function(x, y, h) {
    if (h || (h == 0)) {
        this.setPinHeight(x, y, h/255);
    } else {
        this.setPinHeight(x, y/255)
    }
}
ShapeDisplay.prototype.setPinMaterial = function(x, y, material) {
    if (material)
        var index = this.getIndex(x, y);
    else {
        index = x;
        material = y;
    }
    if (index < this.pins.length)
        this.pins[index].material = material;
}

//new stuff

ShapeDisplay.prototype.clearDisplay = function(h) {
    if (!h) {
        h = this.defaultPinHeight;
    }
    for (var i = 0; i < this.x_size; i++) {
      for (var j = 0; j < this.y_size; j++) {
        this.setPinHeight(i, j, h);
      }
    }
}
ShapeDisplay.prototype.clearDisplayFromPhysical = function(h) {
    this.clearDisplay(h/255);
}

ShapeDisplay.prototype.makeBox = function(x, y, x_size, y_size, height) {
  return new Box(x, y, x_size, y_size, height, this);
}

//touched pins
ShapeDisplay.prototype.getPinTouched = function(x, y) {
    var index = this.getIndex(x,y);
    return this.touchedPins[index];
}
//return first touched pin
ShapeDisplay.prototype.getTouchedPin = function() {
    if (Object.keys(this.touchedPins).length !== 0) {
        return this.getXYFromIndex(Object.keys(this.touchedPins)[0]);
    }
    else return null;
}
ShapeDisplay.prototype.addTouchedPinByIndex = function(index) {
    this.touchedPins[index] = true;
}
ShapeDisplay.prototype.clearDisplayTouches = function() {
    this.touchedPins = {};
}

function Transform(height, scene) {
    this.left = new ShapeDisplay(16, 24, height);
    this.middle = new ShapeDisplay(16, 24, height);
    this.right = new ShapeDisplay(16, 24, height);
    this.shapeDisplays = [this.left, this.middle, this.right];
    this.island_width = 16;
    this.x_size = 16 * 3;
    this.y_size = 24;
    this.size = this.x_size * this.y_size;

    var subWidth = this.left.getTotalWidthAcross();
    this.left.setPositionZ(-13.25 - subWidth/2);
    this.right.setPositionZ(13.25 + subWidth);

    this.container = new THREE.Mesh();
    this.container.add(this.left.getGeometry());
    this.container.add(this.middle.getGeometry());
    this.container.add(this.right.getGeometry());
    scene.add(this.container);
}
Transform.prototype.setPinHeight = function(x, y, h) {
    if (x >= this.x_size || y >= this.y_size) {
        console.log("Setting out of bounds: x: " + x + ", y: " + y);
        return;
    }
    this.shapeDisplays[~~(x/16)].setPinHeight(x%16, y, h);
}
Transform.prototype.setPinHeightFromPhysical = function(x, y, h) {
    this.setPinHeight(x, y, h/255);
}
Transform.prototype.getHeightsMsgForPhysical = function(topHalf) {
    var msg = [];
    var start = topHalf ? 0 : 576;
    var end = topHalf ? 576 : 1152;
    for (var i = start; i < end; i++) {
        var x = i % this.island_width;
        var y = ~~(i/this.x_size);
        var selectedDisplay = this.shapeDisplays[~~((i%this.x_size)/this.island_width)];
        msg.push(~~(selectedDisplay.physicalPinHeights[selectedDisplay.getIndex(x, y)]));
    }
    return msg;
    // return this.shapeDisplays.reduce(function(prev, current, i) {
    //     var currentMsg = current.getHeightsMsgForPhysical(i * 16);
    //
    //     if (currentMsg.length == 0)
    //         return prev;
    //     if (prev.length == 0)
    //         return currentMsg;
    //     return prev + "-" + currentMsg;
    // }, "");
}
Transform.prototype.clearDisplay = function(h) {
    this.shapeDisplays.map(function(display) {
        display.clearDisplay(h);
    });
}
Transform.prototype.clearDisplayFromPhysical = function(h) {
    this.clearDisplay(h/255);
}
Transform.prototype.makeBox = function(x, y, x_size, y_size, h) {
    return new Box(x, y, x_size, y_size, h, this);
}
