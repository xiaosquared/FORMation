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
        piano.material = new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.3});
        piano.name = ('piano');
        piano.scale.set(0.07, 0.07, 0.07);
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
