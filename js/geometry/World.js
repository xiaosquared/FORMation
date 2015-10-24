function World(originX, originY, offsetX, offsetY) {
    this.origin = { x: originX ? originX : 0,
                    y: originY ? originY : 0 };
    this.levels = [];
    this.items = [];
    this.currentLevel = 0;

    this.virtualShapeDisplays = [];  // purely virtual ones not in MacroScope
    this.offsets = [];
}

// Adds a new map to the world's levels
World.prototype.addLevel = function(img, width, height) {
    var canvas = document.createElement('canvas');
    if (width) {
        canvas.width = width;
        canvas.height = height;
    }

    var context = canvas.getContext('2d');
    context.drawImage(img, 0, 0);
    this.levels.push(context);
}
World.prototype.setOrigin = function(x, y) {
    this.origin.x = x;
    this.origin.y = y;
}
World.prototype.addShapeDisplay = function(shapeDisplay, offsetX, offsetY) {
    this.virtualShapeDisplays.push(shapeDisplay);
    this.offsets.push({x: offsetX ? offsetX : 0 , y: offsetY ? offsetY : 0});
}
World.prototype.addItem = function(item) {
    this.items.push(item);
}
World.prototype.getItemByName = function(name) {
    for (var i = 0; i < items.length; i++) {
        if (items[i].name == name)
            return item;
    }
    return;
}

World.prototype.loadCurrentLevelForAllDisplays = function(bSetHeights, bSetMaterials) {
    if (this.virtualShapeDisplays.length == 0)
        return;
    // first set all the items to be invisible
    for (var i = 0; i < this.items.length; i++)
        this.items[i].hide();
    for (var i = 0; i < this.virtualShapeDisplays.length; i++) {
        this.loadCurrentLevel([this.virtualShapeDisplays[i]], bSetHeights, bSetMaterials, this.offsets[i].x, this.offsets[i].y);
    }
}

// Loads current level into the shape display
World.prototype.loadCurrentLevel = function(shapeDisplays, bSetHeights, bSetMaterials, offsetX, offsetY) {
    var width = shapeDisplays[0].getWidthInPins();
    var height = shapeDisplays[0].getHeightInPins();

    offsetX = offsetX ? offsetX : 0;
    offsetY = offsetY ? offsetY : 0;

    var level = this.levels[this.currentLevel];
    var levelData = level.getImageData(this.origin.x + offsetX, this.origin.y + offsetY, width,height).data;

    //console.log(levelData);

    // Iterate through each pixel of the level ONLY ONCE
    for (var i = 0, n = levelData.length; i < n; i += 4) {
        var r = levelData[i];
        var g = levelData[i+1];
        var b = levelData[i+2];
        var a = levelData[i+3];

        // SETTING HEIGHTS
        if (bSetHeights) {
            setHeights(shapeDisplays[0], a, r, g);
            if (shapeDisplays[1])
                setHeights(shapeDisplays[1], a, r, g);
        }
        function setHeights(shapeDisplay, a, r, g) {
            // If we are off the map, make everything a default height
            if (a == 0)
                shapeDisplay.setPinHeightFromPhysical(i/4, 50);
            // if we're drawing logo, make it indented
            // otherwise, get the height from R channel
            else {
                var h = (g == 222) ? Math.max(0, 70 - r/4) : 70 + r/2;
                shapeDisplay.setPinHeightFromPhysical(i/4, h);
            }
        }

        // SETTING MATERIALS
        if (bSetMaterials) {
            // mini one is always a ghost
            if (shapeDisplays[0].container.name == "xFormMini")
                shapeDisplays[0].setPinMaterial(i/4, materials.ghostMaterial);

            else {
                var material;
                var isShadow = xForm.shadowPins.indexOf(i/4) >= 0;
                if (isShadow)
                    material = materials.shadowMaterial;
                    else {
                        if (g == 255 || g == 222)
                            material = materials.wallMaterial;
                        else if (g == 127)
                            material = materials.clearMaterial;
                        else
                            material = materials.darkMaterial;
                    }
                // set the correct material for the large shape display
                shapeDisplays[0].setPinMaterial(i/4, material);
            }

            // also for mini one
            if (shapeDisplays[1])
                shapeDisplays[1].setPinMaterial(i/4, materials.ghostMaterial);
        }

        // PLACING ITEMS
        if (b != 127 && shapeDisplays[0].container.name != "xFormMini") {
            var item = null;
            if (b == 255) {
                //console.log("PIANO");
                item = this.items[0];
            }
            else if (b == 222) {
                //console.log("MINI");
                item = this.items[1];
            }
            else if (b == 111) {
                //console.log("PingPong");
                item = this.items[2];
            }

            if (item) {
                //console.log("B " + b);
                var pinPosition = shapeDisplays[0].pins[i/4].position;
                var displayPosition = shapeDisplays[0].getPosition();
                console.log(shapeDisplays[0].container.name);
                //console.log("PIN Position ", pinPosition.x, pinPosition.z);
                //console.log("Display Position ", displayPosition.x, displayPosition.z);

                var x = i/4 % shapeDisplays[0].xWidth;
                var y = Math.floor(i/4 / shapeDisplays[0].xWidth);

                // hacky way of seeing item is in the scene...
                if (y > item.top && shapeDisplays[0].yWidth-y > item.bottom) {
                    item.placeInScene(-pinPosition.z + displayPosition.x,
                            shapeDisplays[0].height + shapeDisplays[0].pinHeight/2 - pinPosition.y * .8 + item.verticalOffset,
                            pinPosition.x + displayPosition.z);
                }
            }
        }
    }
}

World.prototype.runFunctionForUnit = function(x, y, shapeDisplay) {
    var data = this.levels[this.currentLevel].getImageData(x, y, 1, 1).data;
    // Check if there's something in B channel
    var b = data[2];
    if (b == 127) {
        this.currentLevel = (this.currentLevel + 1) % this.levels.length;
        this.loadCurrentLevel([shapeDisplay], materials);
    }
}

// Other objects inside the model
//------------------------------------------------------------------------------
function Item(name, left, right, top, bottom, verticalOffset) {
    this.name = name;
    this.left = left;
    this.right = right;
    this.top = top;
    this.bottom = bottom;
    this.verticalOffset = verticalOffset ? verticalOffset : 0;
}
Item.prototype.hide = function() {
    var item = scene.getObjectByName(this.name);
    if (!item) {
        console.log("Item " + this.name + " is not in the scene");
        return;
    }
    item.visible = false;
}

Item.prototype.placeInScene = function(x, y, z) {
    var item = scene.getObjectByName(this.name);
    if (!item) {
        console.log("Item " + this.name + " is not in the scene");
        return;
    }
    item.visible = true;
    item.position.set(x, y, z);
}

function loadPiano() {
    var onProgress = function(xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded /xhr.total * 100;
            console.log('Piano Model ' + Math.round(percentComplete, 2) + '% downloaded');}
    };
    var onError = function(xhr) {
            console.log('Error Loading Piano Model');
    };

    var loader = new THREE.OBJMTLLoader();
    loader.load( 'assets/piano.obj', 'assets/piano.mtl', function ( object ) {
        var piano = object.children[0];
        piano.material = materials.ghostMaterial;
        piano.name = ('piano');
        piano.scale.set(0.025, 0.025, 0.025);
        piano.rotation.y = -Math.PI/2;
        scene.add(piano);
    }, onProgress, onError);
}

function createMiniCooperForm() {
    var miniCooperForm = new ShapeDisplay(24, 24, 0, scene);
    var container = miniCooperForm.container;
    container.name = "xFormMini";
    container.scale.set(0.05, 0.05, 0.05);

    var cube = new THREE.Mesh(  new THREE.BoxGeometry(36, 24, 36),
                                materials.ghostMaterial    );

    cube.position.set(12, -8, 12);
    container.add(cube);

    return miniCooperForm;
}

function createPingPongTable() {
    var pp = new THREE.Mesh();
    var ppSurface = new THREE.Mesh(     new THREE.BoxGeometry(60, 1, 35),
                                        materials.ghostMaterial   );
    pp.add(ppSurface);
    pp.position.set(12,14,12);
    pp.scale.set(0.05, 0.05, 0.05);
    pp.name = 'pingPong';
    scene.add(pp);
}

////////////////////////////////////////////////////////////////////////////////

function Player(camera) {
    this.row = 12;
    this.col = 23;

    this.avatarPosition = new THREE.Vector3(0, 13.75, 0);
    this.maquettePosition = new THREE.Vector3(-10, 20, 0);

    this.mesh = new THREE.Mesh(new THREE.CubeGeometry(1, 1, 1),
                            new THREE.MeshLambertMaterial({ color: 'red' }));
    this.mesh.position.copy(this.maquettePosition);

    this.mesh.add(camera);
    scene.add(this.mesh);
}
Player.prototype.moveToSquare = function(row, col, shapedisplay) {
    // If row and col are arrays, get the average and floor it
    if (row instanceof Array) {
        console.log("array for rol and col");
        row = ~~(eval(row.join('+'))/row.length);
        col = ~~(eval(col.join('+'))/col.length);
    }
    if (row >= shapedisplay.xWidth || row < 0 || col >= shapedisplay.yWidth || col < 0)
        return;

    this.row = row, this.col = col;

    if (!device && socket.readyState) {
        socket.send("M" + this.row + "," + this.col);
    }

    var pinPosition = shapedisplay.pins[shapedisplay.getIndex(row, col)].position;
    var displayPosition = shapedisplay.getPosition();

    this.avatarPosition.x = -pinPosition.z + displayPosition.x;
    this.avatarPosition.z = pinPosition.x + displayPosition.z;

    this.tweenToPosition(this.mesh.position, this.avatarPosition);
}
Player.prototype.tweenToPosition = function(fromPosition, toPosition, duration) {
    var tween = new TWEEN.Tween(fromPosition)
                            .to(toPosition, duration ? duration : 1000)
                            .easing(TWEEN.Easing.Sinusoidal.Out)
                            .onUpdate(function() {
                                fromPosition.set(this.x, this.y, this.z);
                            }).start();
}

Player.prototype.toggleMaquetteView = function() {
    if (this.inAvatarView())
        this.tweenToPosition(this.mesh.position, this.maquettePosition);
    else
        this.tweenToPosition(this.mesh.position, this.avatarPosition);
}
Player.prototype.goToMaquetteView = function() {
    if (this.inAvatarView())
        this.tweenToPosition(this.mesh.position, this.maquettePosition);
}
Player.prototype.goToAvatarView = function() {
    if (!this.inAvatarView())
        this.tweenToPosition(this.mesh.position, this.avatarPosition);
}
Player.prototype.inAvatarView = function() {
    return this.mesh.position.x > this.maquettePosition.x + 1;
}
