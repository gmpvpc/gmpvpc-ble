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
});


var sendAction = function (action) {
    socket.send({
        action: action
    });
};


var trace1 = {
    x: [0, 1, 3, 5, 7, 8],
    y: [1, 2, 3, 4, 5, 6],
    z: [0, 0, 1, 1, 2, 2],
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

var layout = {
    margin: {
        l: 0,
        r: 0,
        b: 0,
        t: 0
    }
};

var data = [trace1];

Plotly.newPlot('plot', data, layout);