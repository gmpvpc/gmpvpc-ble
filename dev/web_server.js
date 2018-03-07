import express from 'express';
import http from 'http';
import SocketIO from 'socket.io';

export default class WebServer {
    constructor() {
        this.express = express();
        this.server = http.Server(this.express);
        this.io = new SocketIO(this.server);
    }

    configure() {
        this.express.get('/', (req, resp) => { resp.sendFile(__dirname + '/front/index.html') });
        this.express.get('/js/main.js', (req, resp) => { resp.sendFile(__dirname + "/front/js/main.js") });
        this.express.get('/ply/plotly.min.js', (req, resp) => { resp.sendFile('plotly.min.js', { root: __dirname + '/../node_modules/plotly.js/dist/'}) }); // plotly.min.js
        this.express.get('/io/socket.io.js', (req, resp) => { resp.sendFile('socket.io.js', { root: __dirname + '/../node_modules/socket.io-client/dist/'}) }); // socket.io.js

        this.io.on('connection', (socket) => {
            console.log("Client connected");
        });
    }

    run() {
        this.server.listen(3000, () => {
            console.log("App is listening on the port 3000")
        });
    }
};
