const Net = require('net');
const emuPort = 34000;
const vtsConnection = require('./vts_modules/vtsConnector');

var gameState = {
    "power": 0,
    "star": false,
    "jump": false,
    "swim": false
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
        //console.log(`Data received from client: \n${chunk.toString()}`);
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
        console.log("ERROR combined packet recieved: " + chunk);
        return;
    }
    
    let value = data.value;
    /* 
        TODO:
        separate this into two pieces - one to update state, then one to evaluate what should be done based on total overall state
        with the current semi-stateless method of updating based on last change, it's hard to account for which things should override each other without messy piecemeal stuff
    */
    switch (data.type) {
        case "power":
            if (gameState.power != value) {
                gameState.power = value;
                //TODO: temporary - see comment at top of switch
                if (gameState.death == true) return;
                console.log("Mario powerup " + value + ": send MoveModelRequest and ColorTintRequest");
                vtsConnection.powerup(value);
            }
            break;
        case "star":
            if (gameState.star != value) {
                gameState.star = value;
                console.log("Star status " + value + ": send ColorTintRequest")
                vtsConnection.star(value);
                if (value == false) {
                    vtsConnection.powerup(gameState.power);
                }
            }
            break;
        case "jump":
            if (gameState.jump != value) {
                gameState.jump = value;
                //TODO: temporary - see comment at top of switch
                if (gameState.death == true) return;
                console.log("Jump status " + value + ": send MoveModelRequest")
                vtsConnection.jump(value, gameState.power);
            }
            break;
        case "swim":
            if (gameState.swim != value) {
                gameState.swim = value;
                console.log("Swim mode " + value + ": send ColorTintRequest")
                if (value == true) {
                    vtsConnection.swim();
                }
                else {
                    vtsConnection.powerup(gameState.power);
                }
            }
            break;
        case "death":
            if (gameState.death != value) {
                gameState.death = value;
                console.log("Death state " + value + ": send MoveModelRequest")
                if (value == true) {
                    vtsConnection.death();
                }
                else {
                    gameState.power = 0;
                    vtsConnection.powerup(gameState.power);
                }
            }
            break;
        default:
            break;
    }
}

