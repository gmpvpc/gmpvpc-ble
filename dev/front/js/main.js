/**
 * DEBUT du code inspiré de la documentation suivante:
 * https://threejs.org/docs/index.html#manual/introduction/Creating-a-scene
 */

var scene = new THREE.Scene();

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();

renderer.setSize( window.innerWidth, window.innerHeight );

document.getElementById('canvas').appendChild(renderer.domElement);

var geometry = new THREE.BoxGeometry( 2, 2, 2 );
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

/**
 * FIN du code pompé sur la doc de three.js
 */



const socket = io(); // on ouvre une websocket pour recevoir les données du serveur en temps réel (ou presque)
// socket.on('message', function (data) {
    // document.getElementById('console').innerText += data + "\n"; // j'affiche le message dans une div
// });

/**
 * Cette section permet d'exploiter les données reçus du serveur
 * pour mettre à jour la rotation du cube au fur et à mesure que les données arrivent
 */
socket.on('broadcast', function (data) {
    console.log(data);
    // var heading = data.heading.toFixed(1);
    // var pitch = data.pitch.toFixed(1);
    // var roll = data.roll.toFixed(1);

    // document.getElementById('console').innerText += JSON.stringify(data) + "\n";

    // console.log(heading, pitch, roll);

    // animate(0, 0, roll);
    // animate(pitch, heading, roll);
});


var sendAction = function (action) {
    socket.send({
        action: action
    });
};