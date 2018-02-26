import { DataSeries } from './data-series';

/**
 *
 * EXPRESS AND SOCKET.IO CONF
 *
 */
let mySensor = null;

const express = require('express');
let app = express();
let server = require('http').Server(app);
let io = require('socket.io')(server);

app.get('/', (request, response) => {
    response.sendFile(__dirname + '/index.html');
});

app.use('/public', express.static('front'));

io.on('connection', (socket) => {
    console.log("Client connected");
    socket.on('message', (data) => {
        switch (data.action) {
            case "calibrate":
                console.log("Calibration requested !");
                setTimeout(function(){
                    calibrate(mySensor);
                }, 1);
                break;
            case "connect":
                setTimeout(function () {
                    connect();
                },1);
                break;
            default:
                console.log("unknown action '" + data.action + "' requested");
                break;
        }
    });
});

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

const reportPeriod = 100; // report period in milliseconds

const recordDuration = 50000;// recording duration in milliseconds

let async = require('async');

// handle connexion and data reception
console.log('Waiting for bluetooth...');
let SensorTag = require('sensortag');

let AHRS = require('ahrs');

let madgwick = new AHRS({
    sampleInterval: 2, // Hz
    algorithm: 'Madgwick',
    beta: 0.3,
    kp: 0.5,
    ki: 0
});

let acc_bias_X = 0;
let acc_bias_Y = 0;
let acc_bias_Z = 0;

let calibration_accX = [];
let calibration_accY = [];
let calibration_accZ= [];

let gyro_bias_X = 0;
let gyro_bias_Y = 0;
let gyro_bias_Z = 0;

let calibration_gyroX = [];
let calibration_gyroY = [];
let calibration_gyroZ= [];

let mag_bias_X = 0;
let mag_bias_Y = 0;
let mag_bias_Z = 0;

let calibration_magX = [];
let calibration_magY = [];
let calibration_magZ = [];

/**
 * Cette fonction update la librairie AHRS et envoie un event a socket-IO pour trasmettre la donnee
 * Attitude and Heading Reference System
 */
const updateAHRS = () => {
    const p = dataSeries.getCurrentPoint();

    // madgwick.update(p.gyro.x, p.gyro.y, p.gyro.z, p.accelero.x, p.accelero.y, p.accelero.z, p.magneto.x, p.magneto.y, p.magneto.z);
    madgwick.update(p.gyro.x, p.gyro.y, p.gyro.z, p.accelero.x, p.accelero.y, p.accelero.z);

    // console.log(madgwick.toVector());
    setTimeout(() => {
        io.sockets.emit('broadcast', madgwick.getEulerAngles()); // broadcast the vector to socket.io
    },1);
};

let dataSeries = new DataSeries(updateAHRS);

const addAcceleroToCalibrationArray = (x, y, z) => {
    // console.log(x,y,z);
    calibration_accX.push(x);
    calibration_accY.push(y);
    calibration_accZ.push(z);
};

const addAcceleroToDataSeries = (x, y, z) => {
    dataSeries.addAccelero(x, y, z);
};

const addGyroToCalibrationArray = (x, y, z) => {
    // console.log(x,y,z);
    calibration_gyroX.push(x);
    calibration_gyroY.push(y);
    calibration_gyroZ.push(z);
};

const addGyroToDataSeries = (x, y, z) => {
    dataSeries.addGyro(
        x - gyro_bias_X,
        y - gyro_bias_Y,
        z - gyro_bias_Z
    );
};

const addMagToCalibrationArray = (x, y, z) => {
    // console.log(x,y,z);
    calibration_magX.push(x);
    calibration_magY.push(y);
    calibration_magZ.push(z);
};

const addMagToDataSeries = (x, y, z) => {
    dataSeries.addMagneto(
        (x - mag_bias_X), // / mag_scaleX,
        (y - mag_bias_Y), // / mag_scaleY,
        (z - mag_bias_Z)  // / mag_scaleZ
    );
};

const connect = () => {
    console.log('Discovering BLE devices...');
    SensorTag.discover(function(sensorTag) {
        mySensor = sensorTag;
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
            function (callback) {
                sensorTag.notifySimpleKey(callback);
            },
            function (callback) {
                sensorTag.on('simpleKeyChange', function (left, right) {
                    if (right) {
                        setTimeout(function(){
                            calibrate(mySensor);
                        }, 1);
                    }
                });
                callback();
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
                sensorTag.on('accelerometerChange', addAcceleroToDataSeries);

                sensorTag.on('gyroscopeChange', addGyroToDataSeries);

                sensorTag.on('magnetometerChange', addMagToDataSeries);

                callback();
            },
            function(callback) {
                // console.log("On récolte les données pendant " + recordDuration / 1000 + "s ...");
                // setTimeout(function(){
                //     callback();
                // }, recordDuration);
            },
            function() {
                disconnect();
                process.exit(0); // Cette fonction permet de quitter le programme NodeJS
            }
        ]);
    });
};

const calibrate = (sensorTag) => {
    calibration_accX = [];
    calibration_accY = [];
    calibration_accZ = [];

    calibration_gyroX = [];
    calibration_gyroY = [];
    calibration_gyroZ = [];

    calibration_magX = [];
    calibration_magY = [];
    calibration_magZ = [];

    async.series([
        function(callback) {
            sensorTag.on('accelerometerChange', addAcceleroToCalibrationArray);

            sensorTag.on('gyroscopeChange', addGyroToCalibrationArray);

            sensorTag.on('magnetometerChange', addMagToCalibrationArray);
            callback();
        },
        function(callback) {
            console.log("Merci de poser le capteur sur une surface plane");
            console.log("On récolte 15s de données pour la calibration...");
            setTimeout(function(){
                callback();
            }, 15000);
        },
        function(callback) {
            sensorTag.removeListener('accelerometerChange', addAcceleroToCalibrationArray);

            sensorTag.removeListener('gyroscopeChange', addGyroToCalibrationArray);

            sensorTag.removeListener('magnetometerChange', addMagToCalibrationArray);

            acc_bias_X = calibration_accX.reduce((a, b) => { return a + b; }) / calibration_accX.length; // compute average for accelerometer X axis
            acc_bias_Y = calibration_accY.reduce((a, b) => { return a + b; }) / calibration_accY.length; // compute average for accelerometer X axis
            acc_bias_Z = calibration_accZ.reduce((a, b) => { return a + b; }) / calibration_accZ.length; // compute average for accelerometer X axis

            gyro_bias_X = calibration_gyroX.reduce((a, b) => { return a + b; }) / calibration_gyroX.length; // compute average for gyroscope X axis
            gyro_bias_Y = calibration_gyroY.reduce((a, b) => { return a + b; }) / calibration_gyroY.length; // compute average for gyroscope Y axis
            gyro_bias_Z = calibration_gyroZ.reduce((a, b) => { return a + b; }) / calibration_gyroZ.length; // compute average for gyroscope Z axis

            mag_bias_X = calibration_magX.reduce((a, b) => { return a + b; }) / calibration_magX.length; // compute average for magnetometer X axis
            mag_bias_Y = calibration_magY.reduce((a, b) => { return a + b; }) / calibration_magY.length; // compute average for magnetometer Y axis
            mag_bias_Z = calibration_magZ.reduce((a, b) => { return a + b; }) / calibration_magZ.length; // compute average for magnetometer Y axis

            console.log("Magnometer calibration done !");
            // console.log("accelero bias X: " + acc_bias_X + ", Y: " + acc_bias_Y + ", Z: " + acc_bias_Z);
            console.log("gyro bias X: " + gyro_bias_X + ", Y: " + gyro_bias_Y + ", Z: " + gyro_bias_Z);
            console.log("magneto bias X: " + mag_bias_X + ", Y: " + mag_bias_Y + ", Z: " + mag_bias_Z);

            madgwick = new AHRS({
                sampleInterval: 2, // Hz
                algorithm: 'Madgwick',
                beta: 0.1,
                kp: 0.5,
                ki: 0
            });
            callback();
        }
    ]);
};

const disconnect = (sensorTag) => {
    async.series([
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
        }
    ]);
};