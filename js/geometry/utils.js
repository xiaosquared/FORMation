var scale = chroma.scale(['blue', 'green', 'red']).domain([0, 50]);

function createGeometryFromMap() {
    var depth = 48;
    var width = 48;

    var spacingX = 3;
    var spacingZ = 3;
    var heightOffset = 2;

    var canvas = document.createElement('canvas');
    canvas.width = 28;
    canvas.height = 28;
    var ctx = canvas.getContext('2d');

    var img = new Image();
    img.src = "../../textures/grandcanyon48.png";
    img.onload = function () {
        // draw on canvas
        ctx.drawImage(img, 0, 0);
        var pixel = ctx.getImageData(0, 0, width, depth);

        var geom = new THREE.Geometry;
        var output = [];
        for (var x = 0; x < depth; x++) {
            for (var z = 0; z < width; z++) {
                // get pixel
                // since we're grayscale, we only need one element

                var yValue = pixel.data[z * 4 + (depth * x * 4)] / heightOffset;
                var vertex = new THREE.Vector3(x * spacingX, yValue/5, z * spacingZ);
                geom.vertices.push(vertex);
            }
        }

        // we create a rectangle between four vertices, and we do
        // that as two triangles.
        for (var z = 0; z < depth - 1; z++) {
            for (var x = 0; x < width - 1; x++) {
                // we need to point to the position in the array
                // a - - b
                // |  x  |
                // c - - d
                var a = x + z * width;
                var b = (x + 1) + (z * width);
                var c = x + ((z + 1) * width);
                var d = (x + 1) + ((z + 1) * width);

                var face1 = new THREE.Face3(a, b, d);
                var face2 = new THREE.Face3(d, c, a);

                face1.color = new THREE.Color(scale(getHighPoint(geom, face1)).hex());
                face2.color = new THREE.Color(scale(getHighPoint(geom, face2)).hex())

                geom.faces.push(face1);
                geom.faces.push(face2);
            }
        }

        geom.computeVertexNormals(true);
        geom.computeFaceNormals();
        geom.computeBoundingBox();

        var zMax = geom.boundingBox.max.z;
        var xMax = geom.boundingBox.max.x;

        var mesh = new THREE.Mesh(geom, new THREE.MeshLambertMaterial({
            vertexColors: THREE.FaceColors,
            color: 0x666666,
            shading: THREE.NoShading
        }));
        mesh.translateX(-xMax / 2);
        mesh.translateZ(-zMax / 2);
        scene.add(mesh);
        mesh.name = 'valley';
    };

}

function getHighPoint(geometry, face) {

    var v1 = geometry.vertices[face.a].y;
    var v2 = geometry.vertices[face.b].y;
    var v3 = geometry.vertices[face.c].y;

    return Math.max(v1, v2, v3);
}
