function ShapeDisplay(xWidth, yWidth, height, scene) {
    this.pinSize = 1.0;
    //this.inBetween = .0475;
    this.inBetween = 0.;
    this.xWidth = xWidth;
    this.yWidth = yWidth;
    this.totalWidth = (this.pinSize + this.inBetween) * this.xWidth;
    this.height = height;
    this.container = new THREE.Mesh();
    this.pins = new Array(xWidth * yWidth);
    this.pinHeight = 4;
    this.shadowPins = [];
    this.touchPins = [];
    this.lastPositions = new Array(xWidth & yWidth);

    var pinBlack = THREE.ImageUtils.loadTexture('assets/darkPinTexture.jpg');
    this.material = new THREE.MeshPhongMaterial( { color: 0xeeeeee, shading: THREE.SmoothShading } );
    this.clearMaterial = new THREE.MeshPhongMaterial( { color: 0xeeeeee, shading: THREE.SmoothShading, transparent: true, opacity: 0.3 } );
    this.darkMaterial = new THREE.MeshLambertMaterial( { color: 0x333333, shading: THREE.SmoothShading, map: pinBlack } );
    this.touchMaterial = new THREE.MeshLambertMaterial( {color: 0xdd1111, shading: THREE.SmoothShading });

    for (var i = 0; i < xWidth * yWidth; i++) {
        var pin = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), this.material);
        pin.position.set(i% xWidth * (this.pinSize + this.inBetween) + this.pinSize/2,
                        0, Math.floor(i/xWidth) * (this.pinSize + this.inBetween) + this.pinSize/2);
        pin.scale.set(1, this.pinHeight, 1);
        this.container.add(pin);
        this.pins[i] = pin;

        this.lastPositions[i] = 0;
    }

    var bottom = new THREE.Mesh(new THREE.BoxGeometry(this.getTotalWidth(), 0.1, this.getTotalWidth()),this.darkMaterial);
    bottom.position.set(this.getTotalWidth()/2, 0, this.getTotalWidth()/2);
    this.container.add(bottom);

    if (scene)
        this.addToScene(scene);
    this.container.translateY(this.height - this.pinHeight/2);
    this.container.rotateY(-Math.PI/2);
    this.container.position.set(this.getTotalWidth(), this.container.position.y, -this.getTotalWidth()/2);
}
ShapeDisplay.prototype.getTotalWidth = function() {
    return this.totalWidth;
}
ShapeDisplay.prototype.addToScene = function(scene) {
    scene.add(this.container);
}
ShapeDisplay.prototype.getIndex = function(x, y) {
  return  y * this.xWidth + x;
}
ShapeDisplay.prototype.getPosition = function() {
    return this.container.position;
}
ShapeDisplay.prototype.setPositionZ = function(z) {
    this.container.position.set(    this.container.position.x,
                                    this.container.position.y,
                                    z - this.getTotalWidth()/2);
}
ShapeDisplay.prototype.setPositionX = function(x) {
    this.container.position.set(    x + this.getTotalWidth(),
                                    this.container.position.y,
                                    this.container.position.z);
}
ShapeDisplay.prototype.getPinHeight = function(x, y){
    var index = this.getIndex(x, y);
    if (index < this.pins.length)
        return this.pins[index].position.y;
    return null;
}
ShapeDisplay.prototype.getPinHeightForPhysical = function(x, y) {
    var index = this.getIndex(x, y);
    if (index < this.pins.length)
        return this.pins[index].position.y * 255;
    return null;
}
ShapeDisplay.prototype.setPinHeight = function(x, y, h) {
    if (h || (h == 0)) {
        var index = this.getIndex(x, y);
    } else {
        index = x;
        h = y;
    }
    if (index < this.pins.length) {
        this.pins[index].position.y = h * this.pinHeight;
    }
}
ShapeDisplay.prototype.setPinHeightFromPhysical = function(x, y, h) {
    if (h || (h == 0)) {
        this.setPinHeight(x, y, h/255);
    } else {
        this.setPinHeight(x, y/255)
    }
}

ShapeDisplay.prototype.getActualWidth = function() {
    return (this.pinSize + this.inBetween) * (this.xWidth - 1) + this.pinSize;
}
ShapeDisplay.prototype.getActualHeight = function() {
    return (this.pinSize + this.inBetween) * (this.yWidth - 1) + this.pinSize;
}
ShapeDisplay.prototype.setPinMaterial = function(x, y, type) {
    if (type || (type == 0)) {
        var index = this.getIndex(x, y);
    } else {
        index = x;
        type = y;
    } if (index < this.pins.length) {
        if (type == 0)
            this.pins[index].material = this.material;
        else if (type == 1)
            this.pins[index].material = this.darkMaterial;
        else if (type == 2)
            this.pins[index].material = this.touchMaterial;
        else if (type == 3)
            this.pins[index].material = this.clearMaterial;
    }
}

ShapeDisplay.prototype.setLastPinHeight = function(x, y, height) {
    var index = this.getIndex(x, y);
    if (index < this.lastPositions.length) {
      this.lastPositions[index] = height;
    }
}
ShapeDisplay.prototype.getLastPinHeight = function(x, y, height) {
  var index = this.getIndex(x, y);
  if (index < this.lastPositions.length)
      return this.lastPositions[index];
  return null;
}
