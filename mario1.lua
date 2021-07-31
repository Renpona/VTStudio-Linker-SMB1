console.clear()
json = require "json"
memory.usememorydomain("System Bus")
addPowerup = 0x0756
addStarTimer = 0x079F
addSwimMode = 0x0704
addLevelPalette = 0x0773

power = 0
star = false
swim = false

local function sendData(data)
	packet = json.encode(data)
	comm.socketServerSend(packet)
end

function intToBool(value)
    if value > 0 then
        value = true;
    else
        value = false;
    end
    return value
end

function powerupWatcher()
    value = memory.readbyte(addPowerup)
    if power ~= value then 
        local packet = {type="power", value=value}
        power = packet["value"]
        sendData(packet)
    end
end

function starWatcher()
    value = memory.readbyte(addStarTimer)
    value = intToBool(value)
    if star ~= value then 
        local packet = {type="star", value=value}
        star = packet["value"]
        sendData(packet)
    end
end

function swimWatcher()
    value = memory.readbyte(addSwimMode)
    value = intToBool(value)
    if swim ~= value then 
        local packet = {type="swim", value=value}
        swim = packet["value"]
        sendData(packet)
    end
end

event.onmemorywrite(powerupWatcher, addPowerup)
event.onmemorywrite(starWatcher, addStarTimer)
event.onmemorywrite(swimWatcher, addSwimMode)

while true do
    emu.frameadvance();
end