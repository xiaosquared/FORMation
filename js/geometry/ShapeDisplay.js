function ShapeDisplay(xWidth, yWidth, height, scene) {
    this.pinSize = 1;
    //this.inBetween = .0475;
    this.inBetween = 0;
    this.xWidth = xWidth;
    this.yWidth = yWidth;
    this.height = height;
    this.container = new THREE.Mesh();
    this.pins = new Array(xWidth * yWidth);
    this.pinHeight = 4;
    this.shadowPins = [];
    this.touchPins = [];
    this.lastPositions = new Array(xWidth & yWidth);

    this.material = new THREE.MeshLambertMaterial( { color: 0xffffff, shading: THREE.SmoothShading } );
    this.darkMaterial = new THREE.MeshLambertMaterial( { color: 0x222222, shading: THREE.SmoothShading } );
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
    if (scene)
        this.addToScene(scene);
    this.container.translateY(this.height - this.pinHeight/2);
    this.container.rotateY(-Math.PI/2);
    this.container.position.set(24, this.container.position.y, -12);
}
ShapeDisplay.prototype.getTotalWidth = function() {
    return (this.pinSize + this.inBetween) * this.xWidth;
}
ShapeDisplay.prototype.addToScene = function(scene) {
    scene.add(this.container);
}
ShapeDisplay.prototype.getIndex = function(x, y) {
  return  y * this.xWidth + x;
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
// ShapeDisplay.prototype.setPositionZ = function(z) {
//     this.container.position.set(    this.container.position.x,
//                                     this.container.position.y,
//                                     z - this.getTotalWidth()/2);
// }
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
ShapeDisplay.prototype.setPinMaterial = function(index, type) {
    if (index < this.pins.length) {
    if (type == 0)
      this.pins[index].material = this.material;
    else if (type == 1)
      this.pins[index].material = this.darkMaterial;
    else if (type == 2)
      this.pins[index].material = this.touchMaterial;
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
