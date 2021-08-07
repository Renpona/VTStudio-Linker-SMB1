const basicInfo = {
    "apiName": "VTubeStudioPublicAPI",
    "apiVersion": "1.0",
    "requestID": "testID"
}

function buildRequest(type, data, requestId = "testId") { 
    let request = basicInfo;
    request.messageType = type;
    request.requestID = requestId;
    request.data = data;
    let returnValue = JSON.stringify(request);
    //console.log(returnValue);
    return returnValue;
}

class Colors {
    constructor(red, green, blue, alpha) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }
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

//exports.buildRequest = buildRequest;
module.exports = {
    buildRequest: buildRequest,
    Colors: Colors,
    recolorMesh: recolorMesh,
    MoveResizeRotate: MoveResizeRotate
};