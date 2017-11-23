var id = 'cc78ab7e7c84';

var address = 'cc:78:ab:7e:7c:84';

var async = require('async');

console.log('Waiting for bluetooth...');
var SensorTag = require('sensortag');

console.log('Discovering BLE devices...');
SensorTag.discover(function(sensorTag) {
  console.log('Discovered: ' + sensorTag);

  sensorTag.on('disconnect', function() {
    console.log('Disconnected !');
    process.exit(0);
  });

  async.series([
    function (callback) {
      console.log('Connecting to SensorTag...');
      sensorTag.connectAndSetUp(callback);
    },
    function(callback) {
      console.log('Enabling gyroscope...');
      sensorTag.enableGyroscope(callback);
    },
    function(callback) {
      setTimeout(callback, 2000);
    },
    function(callback) {
        sensorTag.on('gyroscopeChange', function(x, y, z) {
          console.log('\tx = ' + x.toFixed(1) + ' °/s' + '\ty = ' + y.toFixed(1) + ' °/s' + '\tz = ' + z.toFixed(1) + ' °/s');
          // console.log('\tx = %d °/s', x.toFixed(1));
          // console.log('\ty = %d °/s', y.toFixed(1));
          // console.log('\tz = %d °/s', z.toFixed(1));
        });

        console.log('Setting gyroscope report period');
        sensorTag.setGyroscopePeriod(500, function(error) {
          console.log('Notifying gyroscope...');
          sensorTag.notifyGyroscope(function(error) {
            setTimeout(function() {
              console.log('Unnotifying gyroscope...');
              sensorTag.unnotifyGyroscope(callback);
            }, 20000);
          });
        });
      },
      function(callback) {
        console.log('Disabling gyroscope...');
        sensorTag.disableGyroscope(callback);
      },
      function(callback) {
        console.log('Enabling accelerometer...');
        sensorTag.enableAccelerometer(callback);
      },
      function(callback) {
        setTimeout(callback, 2000);
      },
      function(callback) {
        sensorTag.on('accelerometerChange', function(x, y, z) {
          console.log('\tx = ' + x.toFixed(1) + ' G' + '\ty = ' + y.toFixed(1) + ' G' + '\tz = ' + z.toFixed(1) + ' G' );
          // console.log('\tx = %d G', x.toFixed(1));
          // console.log('\ty = %d G', y.toFixed(1));
          // console.log('\tz = %d G', z.toFixed(1));
        });

        console.log('Setting accelerometer report period');
        sensorTag.setAccelerometerPeriod(500, function(error) {
          console.log('Notifying accelerometer');
          sensorTag.notifyAccelerometer(function(error) {
            setTimeout(function() {
              console.log('Unnotifying accelerometer');
              sensorTag.unnotifyAccelerometer(callback);
            }, 20000);
          });
        });
      },
      function(callback) {
        console.log('Disabling accelerometer...');
        sensorTag.disableAccelerometer(callback);
      },
      function(callback) {
        console.log('Disconnecting...');
        sensorTag.disconnect(callback);
      }
  ]);
});
