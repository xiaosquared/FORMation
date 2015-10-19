function World() {
    this.origin = {x: 0, y: 0};
    this.levels = [];
    this.items = [];
    this.currentLevel = 0;
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
// Loads current level into the shape display
World.prototype.loadCurrentLevel = function(shapeDisplay, materials) {
    var width = shapeDisplay.getWidthInPins();
    var height = shapeDisplay.getHeightInPins();

    var level = this.levels[this.currentLevel];
    var levelData = level.getImageData(this.origin.x, this.origin.y, width, height).data;

    // first set all the items to be invisible
    this.items[0].hide();

    for (var i = 0, n = levelData.length; i < n; i += 4) {
        var r = levelData[i];
        var g = levelData[i+1];
        var b = levelData[i+2];
        var a = levelData[i+3];

        // R channel encodes height
        shapeDisplay.setPinHeightFromPhysical(i/4, r/2 + 127);

        // G channel encodes material
        if (g == 255)
            shapeDisplay.setPinMaterial(i/4, materials.getWallMaterial());
        else if (g == 127)
            shapeDisplay.setPinMaterial(i/4, materials.getClearMaterial());
        else
            shapeDisplay.setPinMaterial(i/4, materials.getDarkMaterial());

        // B channel encodes where items are placed
        if (b == 255) {
            var pinPosition = shapeDisplay.pins[i/4].position;
            var displayPosition = shapeDisplay.getPosition();

            var x = i/4 % shapeDisplay.xWidth;
            var y = i/4 / shapeDisplay.xWidth;

            // TODO check if we are too close to the edge;
            var item = this.items[0];
            if (x >= item.left && y >= item.top
                && shapeDisplay.xWidth-x >= item.right
                && shapeDisplay.yWidth-y >= item.bottom) {
                    item.placeInScene(scene, -pinPosition.z + displayPosition.x,
                        shapeDisplay.height + shapeDisplay.pinHeight/2,
                        pinPosition.x + displayPosition.z);
            }
        }
    }
}
World.prototype.runFunctionForUnit = function(x, y, shapeDisplay) {
    var data = this.levels[this.currentLevel].getImageData(x, y, 1, 1).data;
    // Check if there's something in B channel
    var b = data[2];
    if (b ==127) {
        this.currentLevel = (this.currentLevel + 1) % this.levels.length;
        this.loadCurrentLevel(shapeDisplay);
    }
}

// Other objects inside the model
//------------------------------------------------------------------------------
function Item(name, scene, left, right, top, bottom) {
    this.name = name;
    this.left = left;
    this.right = right;
    this.top = top;
    this.bottom = bottom;
}
Item.prototype.hide = function() {
    var item = scene.getObjectByName(this.name);
    if (!item) {
        console.log("Item " + this.name + " is not in the scene");
        return;
    }
    item.visible = false;
}

Item.prototype.placeInScene = function(scene, x, y, z) {
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
        piano.material = new THREE.MeshBasicMaterial({color: 0x666666, transparent: true, opacity: 0.5});
        piano.name = ('piano');
        piano.scale.set(0.025, 0.025, 0.025);
        piano.rotation.y = -Math.PI/2;
        scene.add(piano);
    }, onProgress, onError);
}

function positionModel(obj, x, y, z) {
    if (!obj) {
        console.log("no obj");
        return;
    }
    obj.visibile = true;
    obj.position.set(x, y, z);
}

////////////////////////////////////////////////////////////////////////////////

function Player(scene) {
    this.mesh = new THREE.Mesh(new THREE.CubeGeometry(1, 1, 1),
                            new THREE.MeshLambertMaterial({ color: 'red' }));
    this.row = 12;
    this.col = 12;

    scene.add(this.mesh);
}
Player.prototype.moveToSquare = function(row, col, shapedisplay) {
    this.row = row;
    this.col = col;
    var pinPosition = shapedisplay.pins[shapedisplay.getIndex(row, col)].position;
    var displayPosition = shapedisplay.getPosition();

    this.mesh.position.set(-pinPosition.z + displayPosition.x,
                            shapedisplay.height + shapedisplay.pinHeight/2,
                            pinPosition.x + displayPosition.z);
}
