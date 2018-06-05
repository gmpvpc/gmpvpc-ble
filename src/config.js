const config = {};

config.logger = {
    path: "/var/log/gmpvpc",
    type: "tiny"
};

config.api = {
    "port": 8080,
    "root": "/api",
    "training": {
        "root": "/training",
        "current": "/current"
    }
};

export default config;