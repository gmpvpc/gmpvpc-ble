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
    }
};

config.glove = {
    address: "cc78ab7e7c84"
};

config.dao = {
    uri: "postgres://gmpvpc:gmpvpc@localhost:5432/gmpvpc"
};

export default config;