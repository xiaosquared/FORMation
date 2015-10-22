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
World.prototype.loadCurrentLevel = function(shapeDisplays, materials) {
    var width = shapeDisplays[0].getWidthInPins();
    var height = shapeDisplays[0].getHeightInPins();

    var level = this.levels[this.currentLevel];
    var levelData = level.getImageData(this.origin.x, this.origin.y, width, height).data;

    // first set all the items to be invisible
     for (var i = 0; i < this.items.length; i++)
         this.items[i].hide();

    for (var i = 0, n = levelData.length; i < n; i += 4) {
        var r = levelData[i];
        var g = levelData[i+1];
        var b = levelData[i+2];
        var a = levelData[i+3];

        // unless we're off the map, R channel encodes height
        if (a == 0) {
            shapeDisplays[0].setPinHeightFromPhysical(i/4, 0);
        }
        else {
            // if we're drawing logo, make it indented
            // otherwise, get the height from R channel
            var h = (g == 222) ? 127 - r/2 : 127 + r/2;
            shapeDisplays[0].setPinHeightFromPhysical(i/4, h);

            // take care of mini display
            if (shapeDisplays[1])
                shapeDisplays[1].setPinHeightFromPhysical(i/4, h);
        }


        // G channel encodes material
        var isShadow = false;
        var material = materials.getDarkMaterial(isShadow);
        if (g == 255 || g == 222)
            material = materials.getWallMaterial(isShadow);
        else if (g == 127)
            material = materials.getClearMaterial(isShadow);

        // set the correct material for the large shape display
        shapeDisplays[0].setPinMaterial(i/4, material);

        // mini one is always a ghost
        if (shapeDisplays[1])
            shapeDisplays[1].setPinMaterial(i/4, materials.getGhostMaterial());


        // B channel encodes where items are placed
        if (b != 127) {
            var item = null;
            if (b == 255)
                item = this.items[0];
            else if (b == 222)
                item = this.items[1];
            else if (b == 111)
                item = this.items[2];

            if (item) {
                var pinPosition = shapeDisplays[0].pins[i/4].position;
                var displayPosition = shapeDisplays[0].getPosition();

                var x = i/4 % shapeDisplays[0].xWidth;
                var y = Math.floor(i/4 / shapeDisplays[0].xWidth);

                if (x > item.left && y > item.top && shapeDisplays[0].xWidth-x > item.right && shapeDisplays[0].yWidth-y > item.bottom) {
                    item.placeInScene(-pinPosition.z + displayPosition.x, shapeDisplays[0].height + shapeDisplays[0].pinHeight/2 + item.verticalOffset, pinPosition.x + displayPosition.z);
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
        piano.material = materials.getGhostMaterial();
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
                                materials.getGhostMaterial()    );

    cube.position.set(12, -8, 12);
    container.add(cube);

    return miniCooperForm;
}

function createPingPongTable() {
    var pp = new THREE.Mesh();
    var ppSurface = new THREE.Mesh(     new THREE.BoxGeometry(60, 1, 35),
                                        materials.getGhostMaterial()   );    
    pp.add(ppSurface);
    pp.position.set(12,14,12);
    pp.scale.set(0.05, 0.05, 0.05);
    pp.name = 'pingPong';
    scene.add(pp);
}

function createTable() {
    var tb = new ShapeDisplay(0, 0, 0, scene);
    var container = tb.container;
    container.name = "table";
    container.scale.set(0.05, 0.05, 0.05);
    
    x=27; y=5; z=40; //x y z position of top plane of the table 
    legSize=3;
    
    // Create and add top plane of the table
    var cube = new THREE.Mesh(  new THREE.BoxGeometry(x, y, z),
                                materials.getGhostMaterial()    );       
    cube.position.set(0, 20, 0);
    container.add(cube);
    
    // Create legs of table and set their position
   	var legs= new Array();
	for(var i=0;i<4;i++)
		legs.push(new THREE.Mesh(  new THREE.BoxGeometry(legSize,30, legSize), materials.getGhostMaterial() 	)	);
	
    legs[0].position.set(x/2-legSize,y,z/2-legSize);
    legs[1].position.set(-(x/2-legSize),y,z/2-legSize);
    legs[2].position.set(x/2-legSize,y,-(z/2-legSize));
    legs[3].position.set(-(x/2-legSize),y,-(z/2-legSize));
    
    // Add legs to container
    for(var i=0;i<4;i++)
    	container.add(legs[i]);
    	
    return tb;
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
