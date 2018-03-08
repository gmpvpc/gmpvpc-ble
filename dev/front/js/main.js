const socket = io(); // on ouvre une websocket pour recevoir les données du serveur en temps réel (ou presque)
// socket.on('message', function (data) {
    // document.getElementById('console').innerText += data + "\n"; // j'affiche le message dans une div
// });

/**
 * Cette section permet d'exploiter les données reçus du serveur
 * pour mettre à jour la rotation du cube au fur et à mesure que les données arrivent
 */
socket.on('broadcast', function (data) {
    console.log(data);
    animatePlot(data.x, data.y, data.z);
});


const sendAction = action => {
    socket.send({
        action: action
    });
};


let trace1 = {
    x: [0],
    y: [0],
    z: [0],
	mode: 'line',
	marker: {
		size: 5,
		line: {
		    color: '#D9D9D9',
            width: 0.5
        },
        opacity: 1
    },
    type: 'scatter3d'
};

let layout = {
    margin: {
        l: 0,
        r: 0,
        b: 0,
        t: 0
    }
};

let data = [trace1];
let position = {x: 8, y: 6, z: 2};

Plotly.newPlot('plot', data, layout);

let animatePlot = (x, y, z) => {
    x += trace1.x[trace1.x.length - 1];
    y += trace1.y[trace1.y.length - 1];
    z += trace1.z[trace1.z.length - 1];
    
    Plotly.extendTraces('plot', {
        x: [
            [x]
        ],
        y: [
            [y]
        ],
        z: [
            [z]
        ]
    }, [0]);
};