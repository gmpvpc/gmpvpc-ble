import { DataSeries } from './data-series';

/**
 *
 * EXPRESS AND SOCKET.IO CONF
 *
 */
const express = require('express');
let app = express();
let server = require('http').Server(app);
let io = require('socket.io')(server);

app.get('/', (request, response) => {
    response.sendFile(__dirname + '/index.html');
});

app.use('/public', express.static('front'));

// io.on('connection', (data) => {
//     numOfSockets++;
//     io.sockets.emit('broadcast', "# of active sockets: " + numOfSockets);
// });
//
// io.on('disconnection', (data) => {
//     numOfSockets--;
//     io.sockets.emit('broadcast', "# of active sockets: " + numOfSockets);
// });

server.listen(3000, () => {
    console.log("App is listening on the port 3000")
});

/**
 *
 * SENSOR TAG I/O
 *
 */

// var id = 'cc78ab7e7c84';
const id = 'cc78ab7e8484';

// var address = 'cc:78:ab:7e:7c:84';
const address = 'cc:78:ab:7e:84:84';

const reportPeriod = 200; // report period in milliseconds

const recordDuration = 20000;// recording duration in milliseconds

let async = require('async');

// handle connexion and data reception
console.log('Waiting for bluetooth...');
let SensorTag = require('sensortag');

let AHRS = require('ahrs');

let madgwick = new AHRS({
    sampleInterval: 5, // Hz
    algorithm: 'Mahony',
    beta: 0.4,
    kp: 0.5,
    ki: 0
});

/**
 * Cette fonction update la librairie AHRS et envoie un event a socket-IO pour trasmettre la donnee
 */
const updateAHRS = () => {
    const p = dataSeries.getCurrentPoint();
    madgwick.update(p.gyro.x, p.gyro.y, p.gyro.z, p.accelero.x, p.accelero.y, p.accelero.z, p.magneto.x, p.magneto.y, p.magneto.z);
    // madgwick.update(p.gyro.x, p.gyro.y, p.gyro.z    , p.accelero.x, p.accelero.y, p.accelero.z);
    console.log(madgwick.getEulerAngles());
    setTimeout(() => {``
        io.sockets.emit('broadcast', madgwick.getEulerAngles()); // broadcast the vector to socket.io
    },1);
};

let dataSeries = new DataSeries(updateAHRS);

console.log('Discovering BLE devices...');
SensorTag.discover(function(sensorTag) {
    console.log('Discovered: ' + sensorTag);

    sensorTag.on('disconnect', function() {
        console.log('Disconnected !');
    });

    // Mais qu'est-ce que c'est async ?
    // https://github.com/sandeepmistry/node-sensortag/blob/master/test-cc2650-io.js
    // On utilise async pour attendre que chacune des fonctions de la librairie node-sensortag ait terminé de s'exécuter
    // Il faudra trouver une facon plus générique de se connecter aux sensors à l'avenir
    async.series([
        function (callback) {
            console.log('Connecting to SensorTag...');
            sensorTag.connectAndSetUp(callback);
        },
        function(callback) {
            console.log('Enabling accelerometer...');
            sensorTag.enableAccelerometer(callback);
        },
        function(callback) {
            console.log('Enabling gyroscope...');
            sensorTag.enableGyroscope(callback);
        },
        function(callback) {
            console.log('Enabling magnetometer...');
            sensorTag.enableMagnetometer(callback);
        },

        /**
         * APRES AVOIR ACTIVÉ LES SENSORS IL FAUT DÉFINIR LA FRÉQUENCE DE COLLECTE DES DONNÉES
         * ET NOTIFIER LE SensorTag DE CETTE MODIFICATION, SANS QUOI IL NE FERA RIEN.
         * NB: il faut faire cela pour chaque sensor. A priori l'ordre de notification est le meme que
         * l'ordre de récupération des données
         */
        function(callback) {
            console.log('Setting accelerometer report period');
            sensorTag.setAccelerometerPeriod(reportPeriod, function(error) {
                console.log('Notifying accelerometer');

                sensorTag.notifyAccelerometer(callback);
            });
        },
        function(callback) {
            console.log('Setting gyroscope report period');
            sensorTag.setGyroscopePeriod(reportPeriod, function(error) {
                console.log('Notifying gyroscope...');
                sensorTag.notifyGyroscope(callback);
            });
        },
        function(callback) {
            console.log('Setting magnetometer report period');
            sensorTag.setMagnetometerPeriod(reportPeriod, function(error) {
                console.log('Notifying magnetometer');
                sensorTag.notifyMagnetometer(callback);
            });
        },
        /**
         * ICI on ajoute les données à notre DataSet à mesure qu'on les recoit
         */
        function(callback) {
            sensorTag.on('accelerometerChange', function(x, y, z) {
                dataSeries.addAccelero(x,y,z);
            });
            sensorTag.on('gyroscopeChange', function(x, y, z) {
                dataSeries.addGyro(x,y,z);
            });
            sensorTag.on('magnetometerChange', function(x, y, z) {
                dataSeries.addMagneto(x,y,z);
            });
            callback();
        },
        function(callback) {
            console.log("On récolte les données pendant " + recordDuration / 1000 + "s ...");
            setTimeout(function(){
                callback();
            }, recordDuration);
        },
        /**
         * Pour terminer la communication en beauté, on désactive les sensors un à un
         */
        function(callback) {
            console.log('Unnotifying accelerometer...');
            sensorTag.unnotifyAccelerometer(callback);
        },
        function(callback) {
            console.log('Unnotifying gyroscope...');
            sensorTag.unnotifyGyroscope(callback);
        },
        function(callback) {
            console.log('Unnotifying magnetometer...');
            sensorTag.unnotifyMagnetometer(callback);
        },
        function(callback) {
            console.log('Disabling accelerometer...');
            sensorTag.disableAccelerometer(callback);
        },
        function(callback) {
            console.log('Disabling gyroscope...');
            sensorTag.disableGyroscope(callback);
        },
        function(callback) {
            console.log('Disabling magnetometer...');
            sensorTag.disableMagnetometer(callback);
        },
        function(callback) {
            console.log('Disconnecting...');
            sensorTag.disconnect(callback);
        },
        function() {
            process.exit(0); // Cette fonction permet de quitter le programme NodeJS
        }
    ]);
});