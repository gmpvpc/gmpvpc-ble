import { DataSeries } from './data-series';

// var id = 'cc78ab7e7c84';
const id = 'cc78ab7e8484';

// var address = 'cc:78:ab:7e:7c:84';
const address = 'cc:78:ab:7e:84:84';

const reportPeriod = 500; // report period in milliseconds

const recordDuration = 5000;// recording duration in milliseconds

let async = require('async');

// handle connexion and data reception
console.log('Waiting for bluetooth...');
let SensorTag = require('sensortag');

let AHRS = require('ahrs');

let madgwick = new AHRS({
    sampleInterval: 1/ reportPeriod / 1000, // Hz
    algorithm: 'Madgwick',
    beta: 0.4,
    kp: 0.5,
});

const updateAHRS = () => {
    const p = dataSeries.getCurrentPoint();
    madgwick.update(p.gyro.x, p.gyro.y, p.gyro.z, p.accelero.x, p.accelero.y, p.accelero.z, p.magneto.x, p.magneto.y, p.magneto.z);
    console.log(madgwick.toVector());
};

let dataSeries = new DataSeries(updateAHRS);

console.log('Discovering BLE devices...');
SensorTag.discover(function(sensorTag) {
    console.log('Discovered: ' + sensorTag);

    sensorTag.on('disconnect', function() {
        console.log('Disconnected !');
    });

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
            console.log("On patiente 5s ...");
            setTimeout(function(){
                callback();
            }, recordDuration);
        },
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
            process.exit(0);
        }
    ]);
});