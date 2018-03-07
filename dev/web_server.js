import express from 'express';
import Server from 'http';
import io from 'socket.io';

export class WebServer {
    constructor() {
        this.express = express();
        this.server = Server(this.express);
        this.io = io(this.server);
    }

    configure() {
        app.use('/', this.express.static(__dirname + '/dist/front/'));
        app.use('/io/', this.express.static(__dirname + '../node_modules/socket.io-client/dist/')); // socket.io.js
        app.use('/ply/', this.express.static(__dirname + '../node_modules/plotly.js/dist/')); // plotly.min.js

        io.on('connection', (socket) => {
            console.log("Client connected");
            // socket.on('message', (data) => {
            //     switch (data.action) {
            //         case "calibrate":
            //             console.log("Calibration requested !");
            //             setTimeout(function(){
            //                 calibrate(mySensor);
            //             }, 1);
            //             break;
            //         case "connect":
            //             setTimeout(function () {
            //                 connect();
            //             },1);
            //             break;
            //         default:
            //             console.log("unknown action '" + data.action + "' requested");
            //             break;
            //     }
            // });
        });

    }

    run() {
        server.listen(3000, () => {
            console.log("App is listening on the port 3000")
        });
    }
};
