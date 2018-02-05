import { DataSeries } from './data-series';

// var id = 'cc78ab7e7c84';
var id = 'cc78ab7e8484';

// var address = 'cc:78:ab:7e:7c:84';
var address = 'cc:78:ab:7e:84:84';

var reportPeriod = 500; // report period in milliseconds

var recordDuration = 5000;// recording duration in milliseconds

var async = require('async');

var accelero = [];
var gyro = [];
var magneto = [];
var dataSet = [];

var dS = new DataSeries();

// handle connexion and data reception
console.log('Waiting for bluetooth...');
var SensorTag = require('sensortag');

var AHRS = require('ahrs');

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
                // console.log('\tx = ' + x.toFixed(1) + ' G' + '\ty = ' + y.toFixed(1) + ' G' + '\tz = ' + z.toFixed(1) + ' G\t < ACCELERO' );
                // accelero.push({ X : x, Y : y, Z : z });
                dS.addAccelero(x,y,z);
            });
            sensorTag.on('gyroscopeChange', function(x, y, z) {
                // console.log('\tx = ' + x.toFixed(1) + ' °/s' + '\ty = ' + y.toFixed(1) + ' °/s' + '\tz = ' + z.toFixed(1) + ' °/s\t < GYRO');
                // gyro.push({ X : x, Y : y, Z : z });
                dS.addGyro(x,y,z);
            });
            sensorTag.on('magnetometerChange', function(x, y, z) {
                // console.log('\tx = ' + x.toFixed(1) + ' ' + '\ty = ' + y.toFixed(1) + ' ' + '\tz = ' + z.toFixed(1) + ' \t < MAGNETO' );
                // magneto.push({ X : x, Y : y, Z : z });
                dS.addMagneto(x,y,z);
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
        function(callback) {
            processData();
            callback();
        },
        function() {
            process.exit(0);
        }
    ]);
});

var processData = () => {
    // console.log("Accelero points: " + accelero.length +", Gyro points: " + gyro.length + ", Magneto points: " + magneto.length);
    // console.log(dS.points);



    // var madgwick = new AHRS({
    //     sampleInterval: 5, // Hz
    //     algorithm: 'Madgwick',
    //     beta: 0.4,
    //     kp: 0.5,

    // for(let i = 0; i < accelero.length; i++) {
    //     madgwick.update(gyro[i].X * Math.PI / 180, gyro[i].Y * Math.PI / 180, gyro[i].Z * Math.PI / 180,
    //         accelero[i].X, accelero[i].Y, accelero[i].Z,
    //         magneto[i].X, magneto[i].Y, magneto[i].Z);
    //
    //     madgwick.getQuaternion();
    //     console.log(madgwick.toVector());
    // }
};

var updateAHRS = () => {

};