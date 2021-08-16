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
            //console.log('Received Message: ' + message.utf8Data);
            parseResponse(JSON.parse(message.utf8Data), connection);
        }
    });
    connection.send(auth.requestToken("Renpona", "Mu Linker Project - M1"));
});

function parseResponse(response, connection) {
    //console.log(response);
    if (!auth.token) {
        auth.token = response.data.authenticationToken;
        connection.send(auth.tokenAuth());
    }
    else if (response.messageType == "AuthenticationResponse" && response.data.authenticated == true) {
        powerup(0);
    }
}

/* TODO:
    Shuffle off most of these request builders to a separate file
    The artmesh IDs should be read from a JSON file or something instead of hardcoded like this
    Probably should also put the game-specific stuff in a separate file
    This will probably be part of a larger project-wide code reorganization necessary for user customization support
*/
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

class MoveResizeRotate {
    constructor(time = 0.5, relative = false) {
        this.timeInSeconds = time;
        this.valuesAreRelativeToModel = relative;
    }
    move(x, y) {
        this.positionX = x;
        this.positionY = y;
    }
    resize(size) {
        this.size = size;
    }
    rotate(rotation) {
        this.rotation = rotation;
    }
    send() {
        let request = utils.buildRequest("MoveModelRequest", this);
        vtsConnection.send(request);
    }
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
    let color = new Colors(255, 255, 255, 255);
    let target = hairColor.concat(eyeColor);
    recolorMesh(color, target, false, false);
    let request = new MoveResizeRotate(0, false);
    request.resize(-88);
    request.move(0.18, -0.58)
    request.send();
    //resize(-98);
    //reposition(0.18, -0.58, false);
}

function bigMario() {
    let color = new Colors(255, 255, 255, 255);
    let target = hairColor.concat(eyeColor);
    recolorMesh(color, target, false, false);
    let request = new MoveResizeRotate(0, false);
    request.resize(-85);
    request.move(0.18, -0.30);
    request.send();
    //resize(-95);
    //reposition(0.18, -0.28, false);
}

function fireMario() {
    let color = new Colors(255, 185, 185, 255);
    let target = hairColor.concat(eyeColor);
    recolorMesh(color, target);
}

function starMario(starActive) {
    //TODO: handle what happens when getting a powerup while invincible
    if (starActive == true) {
        let color = new Colors(255, 255, 255, 255);
        let target = hairColor.concat(eyeColor);
        recolorMesh(color, target, true, true);
    } else {
        let color = new Colors(255, 255, 255, 255);
        recolorMesh(color, null, false, true);
    }
}

function jumpMario(jumpValue, marioSize) {
    let request = new MoveResizeRotate(0.3, false);
    let baseX = 0.18;
    let baseY = -0.58;
    let modifier = 0.05;
    if (marioSize > 0) {
        baseY = -0.30;
    }
    if (jumpValue == true) {
        request.move(baseX, baseY + modifier);
    } else {
        request.move(baseX, baseY);
    }
    request.send();
}

function swimMario() {
    let color = new Colors(135, 135, 255, 255);
    let target = hairColor;
    recolorMesh(color, target, false, false);
}

function death() {
    let deathJump = new MoveResizeRotate(0.4, true);
    deathJump.move(0, 0.2);
    deathJump.send();
    setTimeout(function() {
        let deathFall = new MoveResizeRotate(2, true);
        deathFall.move(0, -2.20);
        deathFall.send();
    }, 450);
}

function connectToVts() {
    wsClient.connect('ws://localhost:' + vtsPort);
}

module.exports = {
    connection: vtsConnection,
    powerup: powerup,
    star: starMario,
    jump: jumpMario,
    swim: swimMario,
    death: death,
    connect: connectToVts
};
