const WebSocketClient = require('websocket').client;
const utils = require('./utils');
const Auth = require('./auth');
const auth = new Auth();

const wsClient = new WebSocketClient();
const vtsPort = 8001;
var vtsConnection;

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
            console.log('Received Message: ' + message.utf8Data);
            parseResponse(JSON.parse(message.utf8Data), connection);
        }
    });
    connection.send(auth.requestToken("Renpona", "Mu Linker Project - M1"));
});

function parseResponse(response, connection) {
    console.log(response);
    if (!auth.token) {
        auth.token = response.data.authenticationToken;
        connection.send(auth.tokenAuth());
    }
}

class Colors {
    constructor(red, green, blue, alpha) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }
}

const hairColor = ["ArtMesh1", "ArtMesh2", "ArtMesh5", "ArtMesh6", "ArtMesh7", "ArtMesh8"];
const eyeColor = ["ArtMesh25", "ArtMesh31"];
function recolorMesh(color, mesh, rainbow = false, tintAll = false) {
    let data = {
        "colorTint": {
            "colorR": color.red,
            "colorG": color.green,
            "colorB": color.blue,
            "colorA": color.alpha
        }
    }
    if (tintAll == true) {
        data.artMeshMatcher = {"tintAll": tintAll};
    } else {
        data.artMeshMatcher = {"nameExact": mesh};
    }
    if (rainbow == true) data.colorTint.jeb_ = true;
    
    let request = utils.buildRequest("ColorTintRequest", data);
    vtsConnection.send(request);
}

function powerup(level) {
    switch (level) {
        case 0:
            smallMario();
            break;
        case 1:
            bigMario();
            break;
        case 2:
            fireMario();
            break;
        default:
            break;
    }
}

function smallMario() {
    //TODO: Add support for the VTS "resize avatar" call
    console.log("smol handler reached!");
}

function bigMario() {
    //TODO: Add support for the VTS "resize avatar" call
    console.log("big handler reached!");
}

function fireMario() {
    let color = new Colors(255, 185, 185, 255);
    let target = hairColor.concat(eyeColor);
    recolorMesh(color, target);
}

function starMario(starActive) {
    if (starActive == true) {
        let color = new Colors(255, 255, 255, 255);
        let target = hairColor.concat(eyeColor);
        recolorMesh(color, target, true, true);
    } else {
        let color = new Colors(255, 255, 255, 255);
        recolorMesh(color, null, false, true);
    }
}

function connectToVts() {
    wsClient.connect('ws://localhost:' + vtsPort);
}

module.exports = {
    connection: vtsConnection,
    powerup: powerup,
    star: starMario,
    connect: connectToVts
};
