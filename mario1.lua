console.clear()
json = require "json"
memory.usememorydomain("System Bus")
addPowerup = 0x0756
addStarTimer = 0x079F
addSwimMode = 0x0704
addJumpState = 0x001D

power = 0
star = false
swim = false
jump = false

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

function jumpWatcher()
    --0 is grounded, 1 is jumping, 2 is walking off ledge, 3 is flagpole
    value = memory.readbyte(addJumpState)
    if value == 1 then 
        value = true
    else 
        value = false 
    end
    --console.log(value)
    if jump ~= value then 
        local packet = {type="jump", value=value}
        jump = packet["value"]
        sendData(packet)
    end
end

event.onmemorywrite(powerupWatcher, addPowerup)
event.onmemorywrite(starWatcher, addStarTimer)
event.onmemorywrite(swimWatcher, addSwimMode)
--event.onmemorywrite(jumpWatcher, addJumpState)

while true do
    local frame = emu.framecount()
    if frame % 10 == 0 then
        jumpWatcher()
    end
    emu.frameadvance();
end