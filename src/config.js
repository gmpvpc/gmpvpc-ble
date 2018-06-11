const config = {};

config.logger = {
    path: "/var/log/gmpvpc/gmpvpc.log",
    type: "tiny"
};

config.api = {
    "port": 8080,
    "root": "/api",
    "training": {
        "root": "/training",
        "current": "/current"
    },
    "glove": {
        "root": "/glove",
        "calibration": "/calibration"
    }
};

export default config;