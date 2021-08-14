class GameClass {
    #name;
    #platform;
    #interface;
    #language;
    constructor(gameName, gamePlatform, interfaceType, language = "EN") {
        this.#name = gameName;
        this.#platform = gamePlatform;
        this.#interface = interfaceType;
        this.#language = language;
    }
    getInfo() {
        return [this.#name, this.#platform, this.#language];
    }
    getInterface() {
        return this.#interface;
    }
    events = {
        init() {
            console.error(`Init function for game ${this.#game} needs to be defined!`);
        } 
    };
    addEvents(eventObj) {
        this.events = eventObj;
    }
}