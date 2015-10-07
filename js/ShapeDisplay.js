function ShapeDisplay(xWidth, yWidth, height, scene) {
    //physical pin size = 9.525mm
    this.pinSize = .9525;
    //physical pin spacing = 3.175mm
    this.inBetween = .3175;
    this.xWidth = xWidth;
    this.yWidth = yWidth;
    this.height = height;
    
    //total number of different height values
    this.heightValues = 256;
    //physical range of height: 100mm, for now 50mm;
    this.heightRange = 5;

    this.container = new THREE.Mesh();
    this.pins = new Array(xWidth * yWidth);

    var material = new THREE.MeshLambertMaterial( { color: 0xdddddd, shading: THREE.SmoothShading } );

    for (var i = 0; i < xWidth * yWidth; i++) {
        var pin = new THREE.Mesh(new THREE.BoxGeometry(this.pinSize, this.pinSize, this.pinSize), material);
        pin.position.set(i% xWidth * (this.pinSize + this.inBetween) + this.pinSize/2,
                        this.height, Math.floor(i/xWidth) * (this.pinSize + this.inBetween) + this.pinSize/2);
        pin.scale.set(1, 10, 1);
        this.container.add(pin);
        this.pins[i] = pin;
    }
    if (scene)
        this.addToScene(scene);
}
ShapeDisplay.prototype.addToScene = function(scene) {
    scene.add(this.container);
}
ShapeDisplay.prototype.setPosition = function(x, y) {
    this.container.position.x = x;
    this.container.position.z = y;
}
ShapeDisplay.prototype.getPinHeight = function(x, y){
    var index = y * this.xWidth + x;
    if (index < this.pins.length)
        return this.pins[index].position.y;
    return null;
}
ShapeDisplay.prototype.setPinHeight = function(x, y, height) {
    var index = y * this.xWidth + x;
    if (index < this.pins.length) {
        this.pins[index].position.y = height + this.height;
    }
}
ShapeDisplay.prototype.drawBox = function(x, y, width, length, height) {
    x = Math.floor(x);
    y = Math.floor(y);
    width = Math.floor(width);
    length = Math.floor(length);
    for (i = x; i < x + width; i++) {
       for (j = y; j < y + length; j++) {
         this.setPinHeight(i, j, height);
       }
    }
}
ShapeDisplay.prototype.drawCylinder = function(x, y, width, height) {
    //
}
ShapeDisplay.prototype.getActualWidth = function() {
    return (this.pinSize + this.inBetween) * (this.xWidth - 1) + this.pinSize;
}
ShapeDisplay.prototype.getActualHeight = function() {
    return (this.pinSize + this.inBetween) * (this.yWidth - 1) + this.pinSize;
}

function Transform(scene) {
    //this.leftDisplay = new ShapeDisplay(16, 24, 10, scene);
    this.midDisplay = new ShapeDisplay(16, 24, 0, scene);
    this.rightDisplay = new ShapeDisplay(16, 24, 0, scene);

    this.displayWidth = this.midDisplay.getActualWidth();
    this.displayHeight = this.midDisplay.getActualHeight();
    this.spacerWidth = 14.25;
    this.spacerHeight = this.displayHeight;

    this.midDisplay.setPosition(this.displayWidth + this.spacerWidth, 0);
    this.rightDisplay.setPosition((this.displayWidth + this.spacerWidth)*2, 0);


    var spacerMaterial = new THREE.MeshLambertMaterial( { color: 0x444444, shading: THREE.SmoothShading } );
    //
    // var spacerLeft = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), spacerMaterial);
    // spacerLeft.scale.set(14.25, 2, this.displayHeight);
    // spacerLeft.position.set(this.displayWidth + this.spacerWidth/2, -2, this.leftDisplay.getActualHeight()/2);
    // scene.add(spacerLeft);

    var spacerRight = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), spacerMaterial);
    spacerRight.scale.set(14.25, 2, this.displayHeight);
    spacerRight.position.set(this.displayWidth*2 + this.spacerWidth*3/2, -2, this.midDisplay.getActualHeight()/2);
    scene.add(spacerRight);
}
