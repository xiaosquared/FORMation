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

function ShapeDisplay(columns, rows, height, scene) {
    this.pinSize = 1.0;
    this.inBetween = 0.;
    this.columns = columns;
    this.rows = rows;
    this.totalWidthAcross = (this.pinSize + this.inBetween) * this.columns;
    this.totalWidthDown = (this.pinSize + this.inBetween) * this.rows;
    this.height = height;
    this.pinLength =7;

    this.container = new THREE.Mesh();
    this.pins = new Array(columns * rows);
    this.physicalPinHeights = new Array(columns * rows);
    this.prevPhysicalPinHeights = new Array(columns * rows);

    for (var i = 0; i < columns * rows; i++) {
        var pin = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), materials.whiteMaterial);
        pin.position.set(i% columns * (this.pinSize + this.inBetween) + this.pinSize/2,
                        0, Math.floor(i/columns) * (this.pinSize + this.inBetween) + this.pinSize/2);
        pin.scale.set(1, this.pinLength, 1);
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
ShapeDisplay.prototype.getNumColumns = function() {
    return this.columns;
}
ShapeDisplay.prototype.getNumRows = function() {
    return this.rows;
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
  return  y * this.columns + x;
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
    var msg = "";
    for (var x = 0; x < this.columns; x++) {
        for (var y = 0; y < this.rows; y++) {
            var index = this.getIndex(x, y);
            var h = this.physicalPinHeights[index];
            var prev_h = this.prevPhysicalPinHeights[index];
            if (h != prev_h) {
                msg += x + "," + y + "," + h + "-";
                this.prevPhysicalPinHeights[index] = h;
            }
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

ShapeDisplay.prototype.clearDisplay = function(height) {
    if (!height) {
        height = 0;
    }
    for (var i = 0; i < this.columns; i++) {
      for (var j = 0; j < this.rows; j++) {
        this.setPinHeight(i, j, height);
      }
    }
}

ShapeDisplay.prototype.makeBox = function(x, y, columns, rows, height) {
  return new Box(x, y, columns, rows, height, this);
}
