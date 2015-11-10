(function(){
  var scene,
  camera,
  renderer,
  element,
  container,
  effect,
  controls,
  clock,
  control;

  var sHost = window.location.origin;
  var socket = io.connect(sHost);

  socket.on('connect', function(){
    socket.emit('config', 'HELO');
  });

  init();

  function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.001, 5000);
    camera.position.set(0, 10, 0);
    scene.add(camera);

    renderer = new THREE.WebGLRenderer();
    element = renderer.domElement;
    container = document.getElementById('webglviewer');
    container.appendChild(element);

    socket.on('init', function(data){
      //GUI Control
      addControls(data);

      clock = new THREE.Clock();

      animate();
    })
  }

  function sendMessage(data){

    Object.keys(data).forEach(function(key) {
      data[key] = Math.round(data[key]*10)/10;
    });
    console.log(data)
    socket.emit('update', data);
  }


  function addControls(controlObj){
    var gui = new dat.GUI();
    var arr = [];

    for (var key in controlObj) {
        arr.push(key)
    }

    for(var i=0; i<arr.length; i++){
      gui.add(controlObj, arr[i], 1, 10).onChange(function(value){
        sendMessage(controlObj);
      });
    }
  }

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
})();
