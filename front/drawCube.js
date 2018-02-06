var scene = new THREE.Scene();

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();

renderer.setSize( window.innerWidth, window.innerHeight );

document.getElementById('canvas').appendChild(renderer.domElement);

var geometry = new THREE.BoxGeometry( 3, 1, 2 );
var material = new THREE.MeshNormalMaterial();
var cube = new THREE.Mesh( geometry, material );

scene.add( cube );

camera.position.z = 5;

renderer.render(scene, camera);

var animate = function (x, y, z) {
    cube.rotation.x = x;
    cube.rotation.y = y;
    cube.rotation.z = z;
    cube.rotation.order = 'XYZ';

    renderer.render(scene, camera);
};


const socket = io();
socket.on('message', function (data) {
    document.getElementById('console').innerText += data + "\n";
});

socket.on('broadcast', function (data) {
    // document.getElementById('console').innerText += JSON.stringify(data) + "\n";
    console.log(data.heading.toFixed(2), data.pitch.toFixed(2), data.roll.toFixed(2));
    animate(data.heading.toFixed(2), data.pitch.toFixed(2), data.roll.toFixed(2));
});