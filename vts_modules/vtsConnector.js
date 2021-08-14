const WebSocketClient = require('websocket').client;
const utils = require('./utils');
const Auth = require('./auth');
const auth = new Auth();

const wsClient = new WebSocketClient();
const vtsPort = 8001;
var vtsConnection;
var currentGame;

function initServer(game) {
    var currentGame = game;
    wsClient.on('connectFailed', function (error) {
        console.log('Connect Error: ' + error.toString());
    });
    
    wsClient.on('connect', function (connection) {
        vtsConnection = connection;
        console.log('WebSocket Client Connected');
        connection.on('error', function (error) {
            console.log("Connection Error: " + error.toString());
        });
        connection.on('close', function () {
            console.log('Connection Closed');
        });
        connection.on('message', function (message) {
            if (message.type === 'utf8') {
                //console.log('Received Message: ' + message.utf8Data);
                parseResponse(JSON.parse(message.utf8Data), connection);
            }
        });
        connection.send(auth.requestToken("Renpona", "Mu Linker Project - M1"));
    });        
}

function parseResponse(response, connection) {
    //console.log(response);
    if (!auth.token) {
        auth.token = response.data.authenticationToken;
        connection.send(auth.tokenAuth());
    }
    else if (response.messageType == "AuthenticationResponse" && response.data.authenticated == true) {
        game.initGame();
    }
}

/* TODO:
    [s]Shuffle off most of these request builders to a separate file[/s]
    The artmesh IDs should be read from a JSON file or something instead of hardcoded like this
    [s]Probably should also put the game-specific stuff in a separate file[/s]
    This will probably be part of a larger project-wide code reorganization necessary for user customization support
*/

const hairColor = ["ArtMesh1", "ArtMesh2", "ArtMesh5", "ArtMesh6", "ArtMesh7", "ArtMesh8"];
const eyeColor = ["ArtMesh25", "ArtMesh31"];

function connectToVts() {
    wsClient.connect('ws://localhost:' + vtsPort);
}

module.exports = {
    connection: vtsConnection,
    connect: connectToVts
};
