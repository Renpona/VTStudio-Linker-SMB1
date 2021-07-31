const Net = require('net');
const emuPort = 34000;
const vtsConnection = require('./vts_modules/vtsConnector');

var gameState = {
    "power": 0,
    "star": false,
    "jump": false,
}

const server = Net.createServer();
server.listen(emuPort, function() {
    console.log(`Server listening for connection requests on socket localhost:${emuPort}`);
});

server.on('connection', function(socket) {
    console.log('A new connection has been established.');
    console.log('Socket state is ' + socket.readyState);

    vtsConnection.connect();
    
    socket.on('data', function(chunk) {
        console.log(`Data received from client: \n${chunk.toString()}`);
        processChunk(chunk);
    });
    socket.on('drain', function() {
        console.log("data write completed");
    })
    socket.on('end', function() {
        console.log('Closing connection with the client');
    });
    socket.on('error', function(err) {
        console.log(`Error: ${err}`);
    });
});

function processChunk(chunk) {
    let data;
    try {
        data = JSON.parse(chunk);
    } catch (error) {
        return;
    }
    
    let value = data.value;
    switch (data.type) {
        case "power":
            if (gameState.power != value) {
                console.log("send powerup");
                gameState.power = value;
                vtsConnection.powerup(value);
            }
            else console.log("don't send powerup");
            break;
        case "star":
            if (gameState.star != value) {
                gameState.star = value;
                vtsConnection.star(value);
            }
            break;
        case "swim":
            console.log("swim " + value);
            break;
        default:
            break;
    }
}

