const utils = require('./utils.js');

class Auth {
    constructor() {
        this.token = null;
        this.appName = null;
        this.devName = null;
    }
    requestToken(name, developer) {
        this.appName = name;
        this.devName = developer;
        let data = {
            "pluginName": this.appName,
            "pluginDeveloper": this.devName,
        };
        let request = utils.buildRequest("AuthenticationTokenRequest", data);
        console.log("Sent Message: " + request)
        return request;
    }
    tokenAuth() {
        let data = {
            "pluginName": this.appName,
            "pluginDeveloper": this.devName,
            "authenticationToken": this.token
        };
        let request = utils.buildRequest("AuthenticationRequest", data)
        console.log("Sent Message: " + request)
        return request;
    }
    //TODO: Add ability to save token locally so that it doesn't have to be re-approved every time
}

module.exports = Auth;