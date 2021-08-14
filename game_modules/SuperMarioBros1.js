const GameClass = require("GameClass");
const utils = require("../vts_modules/utils");


const mario = new GameClass("Super Mario Bros 1", "NES", "BizHawk");

/**
 * TODO: 
 * in the long run, positioning, mesh targets, and at least some colors should be read from a file
 * because many of them, especially sizing/positioning, will vary from avatar to avatar
 */
const baseColors = new utils.Colors(255, 255, 255, 255);
const swimColors = new utils.Colors(135, 135, 255, 255);
const fireColors = new utils.Colors(255, 185, 185, 255);

//smallMario: resize(-98), reposition(0.18, -0.58, false);
//bigMario: resize(-95), reposition(0.18, -0.28, false);

//TODO: In the long run, the entire event list should be read from JSON
var events = {
    initGame: function() {
        this.powerup(0);
    },
    powerup: function(level) {
        switch (level) {
            case 0:
                this.smallMario();
                break;
            case 1:
                this.bigMario();
                break;
            case 2:
                this.fireMario();
                break;
            default:
                break;
        }
    },
    smallMario: function() {
        let color = baseColors;
        let target = hairColor.concat(eyeColor);
        utils.recolorMesh(color, target, false, false);
        let request = new utils.MoveResizeRotate(0, false);
        request.resize(-98);
        request.move(0.18, -0.58)
        request.send();
    },
    bigMario: function() {
        let color = baseColors;
        let target = hairColor.concat(eyeColor);
        utils.recolorMesh(color, target, false, false);
        let request = new utils.MoveResizeRotate(0, false);
        request.resize(-95);
        request.move(0.18, -0.30);
        request.send();
    },
    fireMario: function() {
        let color = fireColors;
        let target = hairColor.concat(eyeColor);
        utils.recolorMesh(color, target);
    },
    starMario: function(starActive) {
        //TODO: handle what happens when getting a powerup while invincible
        if (starActive == true) {
            let color = baseColors;
            let target = hairColor.concat(eyeColor);
            utils.recolorMesh(color, target, true, true);
        } else {
            let color = baseColors;
            utils.recolorMesh(color, null, false, true);
        }
    },
    jumpMario: function(jumpValue, marioSize) {
        let request = new utils.MoveResizeRotate(0.3, false);
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
    },
    swimMario: function() {
        let color = swimColors;
        let target = hairColor;
        utils.recolorMesh(color, target, false, false);
    },
    death() {
        let deathJump = new utils.MoveResizeRotate(0.4, true);
        deathJump.move(0, 0.2);
        deathJump.send();
        setTimeout(function() {
            let deathFall = new utils.MoveResizeRotate(2, true);
            deathFall.move(0, -2.20);
            deathFall.send();
        }, 450);
    }
}

mario.addEvents(events);

module.exports.game = mario;