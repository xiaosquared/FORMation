var materials = (function() {
    var m = {};
    var pinBlack = THREE.ImageUtils.loadTexture('assets/darkPinTexture.jpg');
    m.wallMaterial = new THREE.MeshPhongMaterial( { color: 0xeeeeee, shading: THREE.SmoothShading } );
    m.clearMaterial = new THREE.MeshPhongMaterial( { color: 0xeeeeee, shading: THREE.SmoothShading, transparent: true, opacity: 0.3 } );
    m.darkMaterial = new THREE.MeshLambertMaterial( { color: 0x333333, map: pinBlack } );
    m.touchMaterial = new THREE.MeshLambertMaterial( {color: 0xdd1111 });

    m.shadowMaterial = new THREE.MeshPhongMaterial( {color: 0x666666, shading: THREE.SmoothShading });
    m.shadowClearMaterial = new THREE.MeshPhongMaterial( {color: 0x666666, shading: THREE.SmoothShading, transparent:true, opacity: 0.3 });

    m.ghostMaterial = new THREE.MeshBasicMaterial({color: 0x999999, transparent: true, opacity: 0.5});
    return m;
})();

function ShapeDisplay(xWidth, yWidth, height, scene) {
    this.pinSize = 1.0;
    this.inBetween = 0.;
    this.xWidth = xWidth;
    this.yWidth = yWidth;
    this.totalWidth = (this.pinSize + this.inBetween) * this.xWidth;
    this.height = height;
    this.container = new THREE.Mesh();
    this.pins = new Array(xWidth * yWidth);
    this.pinHeight = 6;
    this.shadowPins = [];
    this.touchPins = [];
    this.lastPositions = new Array(xWidth & yWidth);

    for (var i = 0; i < xWidth * yWidth; i++) {
        var pin = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), materials.darkMaterial);
        pin.position.set(i% xWidth * (this.pinSize + this.inBetween) + this.pinSize/2,
                        0, Math.floor(i/xWidth) * (this.pinSize + this.inBetween) + this.pinSize/2);
        pin.scale.set(1, this.pinHeight, 1);
        this.container.add(pin);
        this.pins[i] = pin;

        this.lastPositions[i] = 0;
    }

    var bottom = new THREE.Mesh(new THREE.BoxGeometry(this.getTotalWidth(), 0.1, this.getTotalWidth()), materials.darkMaterial);
    bottom.position.set(this.getTotalWidth()/2, 0, this.getTotalWidth()/2);
    this.container.add(bottom);

    if (scene)
        this.addToScene(scene);
    this.container.translateY(this.height - this.pinHeight/2);
    this.container.rotateY(-Math.PI/2);
    this.container.position.set(this.getTotalWidth(), this.container.position.y, -this.getTotalWidth()/2);
}
ShapeDisplay.prototype.getGeometry = function() {
    return this.container;
}
ShapeDisplay.prototype.getWidthInPins = function() {
    return this.xWidth;
}
ShapeDisplay.prototype.getHeightInPins = function() {
    return this.yWidth;
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
        return this.pins[index].position.y * 255 / this.pinHeight;
    return null;
}
ShapeDisplay.prototype.getHeightsMsgForPhysical = function() {
    var msg = "";
    for (var x = 0; x < this.xWidth; x++) {
        for (var y = 0; y < this.yWidth; y++) {
            var h = this.getPinHeightForPhysical(x, y);
            msg += x + "," + y + "," + h + "-";
        }
    }
    return msg.substring(0, msg.length -1);
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
