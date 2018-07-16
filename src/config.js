const config = {};

config.logger = {
    path: "/var/log/gmpvpc/gmpvpc.log",
    type: "tiny"
};

config.api = {
    port: 8080,
    root: "/api",
    training: {
        root: "/training",
        current: "/current"
    },
    glove: {
        root: "/glove",
        calibration: "/calibration"
    },
    series: {
        root: "/series"
    },
    device: {
        root: "/device",
        register: "/register",
        unregister: "/unregister",
        info: "/info",
        version: "/version",
    }
};

config.glove = {
    address: "cc78ab7e7c84",
    calibration: true,
    calibrationPoint: 20,
    defaultPeriod: 100
};

config.dao = {
    uri: "postgres://gmpvpc:gmpvpc@127.0.0.1:5432/gmpvpc",
    force: true
};

config.domain = {
    pointNumbersToAvg: 10
};

config.rabbit = {
    queue: "gmpvpc",
    exchange: "gmpvpc",
    url: "amqp://gmpvpc:gmpvpc@127.0.0.1:5672"
};

config.debug = {
    influx: false
};

export default config;