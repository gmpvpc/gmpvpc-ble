// import { DataSeries } from './data-series';
import {PointDAO} from "./dao/point/point-dao";
import {Point} from "./model/point";

/**
 *
 * EXPRESS AND SOCKET.IO CONF
 *
 */
let mySensor = null;

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


let avg_acc_Y = [];

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

let normesCarre_tab = [];

const dao = new PointDAO();


let hitStart = false;
const hitDetection = (ax, ay, az) => {
    let normeAuCarre = Math.pow(ax,2) + Math.pow(ay, 2) + Math.pow(az, 2);

    if(normeAuCarre > 1 && !hitStart) {
        console.log("HIT START");
        hitStart = true;
        // we've got a hit start

        // enabled accurate mode

        // detect end of hit with avg going down
    }

    if (normesCarre_tab.length == 11) {
        normesCarre_tab.shift();
    }
    normesCarre_tab.push(normeAuCarre);

    let avg = normesCarre_tab.reduce((pv, cv) => { return pv + cv; }, 0) / normesCarre_tab.length;

    if (hitStart && avg < 1){
        console.log("END\n");

        hitStart = false;
    }

    return avg;
};

const addAcceleroToCalibrationArray = (x, y, z) => {
    // console.log(x,y,z);
    calibration_accX.push(x);
    calibration_accY.push(y);
    calibration_accZ.push(z);
};

const sendAcceleroToInfluxDB = (x, y, z) => {
    x = Math.round((x - acc_bias_X) * 10) / 10;
    y = Math.round((y - acc_bias_Y) * 10) / 10;
    z = Math.round((z - acc_bias_Z) * 10) / 10;
    console.log("x:\t" + x + "\t\ty:\t" + y + "\t\tz:\t" + z);
    const point = new Point();
    point.gyro.fromXYZ(0,0,0);
    point.magneto.fromXYZ(0,0,0);
    point.accelero.fromXYZ(x, y, z);
    
    hitDetection(x, y, z);


    dao.save(point, 777);
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
            // function (callback) {
            //     calibrate(sensorTag, callback);
            // },
            // function(callback) {
            //     console.log('Enabling gyroscope...');
            //     sensorTag.enableGyroscope(callback);
            // },
            // function(callback) {
            //     console.log('Setting gyroscope report period');
            //     sensorTag.setGyroscopePeriod(reportPeriod, function(error) {
            //         console.log('Notifying gyroscope...');
            //         sensorTag.notifyGyroscope(callback);
            //     });
            // },
            function(callback) {
                console.log('Setting acceleroMeter report period');
                sensorTag.setAccelerometerPeriod(reportPeriod, function(error) {
                    console.log('Notifying accelerometer');
                    sensorTag.notifyAccelerometer(callback);
                });
            },
            /**
             * ICI on ajoute les données à notre DataSet à mesure qu'on les recoit
             */
            function(callback) {
                sensorTag.on('accelerometerChange', sendAcceleroToInfluxDB);

                // sensorTag.on('gyroscopeChange', addGyroToDataSeries);

                // sensorTag.on('magnetometerChange', addMagToDataSeries);

                callback();
            },
            () => {
                // ici on ne fait rien, on attend bien sagement que l'utilisateur fasse un CTRL+C
            },
            function() {
                disconnect();
                process.exit(0); // Cette fonction permet de quitter le programme NodeJS
            }
        ]);
    });
};

const calibrate = (sensorTag, extCallback) => {
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
        callback => {
            console.log("Merci de poser le capteur sur une surface plane");
            const truc = setInterval(() => {
                sensorTag.readAccelerometer(function(error, x, y, z) {
                    addAcceleroToCalibrationArray(x,y,z);
                });
            }, 200);

            console.log("On récolte 15s de données pour la calibration...");
            setTimeout(() => {
                clearInterval(truc);
                callback();
            }, 15000);
        },
        callback => {
            // sensorTag.removeListener('accelerometerChange', addAcceleroToCalibrationArray);

            // sensorTag.removeListener('gyroscopeChange', addGyroToCalibrationArray);

            // sensorTag.removeListener('magnetometerChange', addMagToCalibrationArray);

            acc_bias_X = calibration_accX.reduce((a, b) => { return a + b; }, 0) / calibration_accX.length; // compute average for accelerometer X axis
            acc_bias_Y = calibration_accY.reduce((a, b) => { return a + b; }, 0) / calibration_accY.length; // compute average for accelerometer X axis
            acc_bias_Z = calibration_accZ.reduce((a, b) => { return a + b; }, 0) / calibration_accZ.length; // compute average for accelerometer X axis

            // gyro_bias_X = calibration_gyroX.reduce((a, b) => { return a + b; }) / calibration_gyroX.length; // compute average for gyroscope X axis
            // gyro_bias_Y = calibration_gyroY.reduce((a, b) => { return a + b; }) / calibration_gyroY.length; // compute average for gyroscope Y axis
            // gyro_bias_Z = calibration_gyroZ.reduce((a, b) => { return a + b; }) / calibration_gyroZ.length; // compute average for gyroscope Z axis

            // mag_bias_X = calibration_magX.reduce((a, b) => { return a + b; }) / calibration_magX.length; // compute average for magnetometer X axis
            // mag_bias_Y = calibration_magY.reduce((a, b) => { return a + b; }) / calibration_magY.length; // compute average for magnetometer Y axis
            // mag_bias_Z = calibration_magZ.reduce((a, b) => { return a + b; }) / calibration_magZ.length; // compute average for magnetometer Y axis

            console.log("Calibration done !");
            console.log("accelero bias X: " + acc_bias_X + ", Y: " + acc_bias_Y + ", Z: " + acc_bias_Z);
            // console.log("gyro bias X: " + gyro_bias_X + ", Y: " + gyro_bias_Y + ", Z: " + gyro_bias_Z);
            // console.log("magneto bias X: " + mag_bias_X + ", Y: " + mag_bias_Y + ", Z: " + mag_bias_Z);

            // madgwick = new AHRS({
            //     sampleInterval: 2, // Hz
            //     algorithm: 'Madgwick',
            //     beta: 0.1,
            //     kp: 0.5,
            //     ki: 0
            // });
            extCallback();
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

connect();