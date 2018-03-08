import WebServer from './web_server';

const server = new WebServer();

const rand = (min, max) => {
    return Math.random() * (max - min) + min;
};

server.configure();
server.run();

setInterval(() => {
    const data = { x: rand(-5, 5), y: rand(-5, 5), z: rand(-5, 5) };
    server.broadcast('broadcast', data);
}, 100);