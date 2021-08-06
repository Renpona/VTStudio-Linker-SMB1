console.clear()
json = require "json"
memory.usememorydomain("System Bus")
addPowerup = 0x0756
addStarTimer = 0x079F
addSwimMode = 0x0704
addJumpState = 0x001D
addMarioState = 0x000E
--only way to tell if Mario died by falling in a pit
addDeathMusic = 0x0712

power = 0
star = false
swim = false
jump = false
death = false

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
        if death == false then
            sendData(packet)
        end
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

function enemyDeathWatcher()
    --08 is normal, 0B is dying, 06 is game over
    value = memory.readbyte(addMarioState)
    if value == 0x0B or value == 0x06 then 
        console.log("death true, value")
        console.log(value)
        value = true        
    else 
        value = false 
    end
    if death ~= value then 
        local packet = {type="death", value=value}
        death = packet["value"]
        sendData(packet)
    end
end

function pitDeathWatcher()
    value = memory.readbyte(addDeathMusic)
    value = intToBool(value)
    if death ~= value then 
        local packet = {type="death", value=value}
        death = packet["value"]
        sendData(packet)
    end
end

--event handlers that watch specific memory addresses and call a function whenever those addresses are changed
event.onmemorywrite(powerupWatcher, addPowerup)
event.onmemorywrite(starWatcher, addStarTimer)
event.onmemorywrite(swimWatcher, addSwimMode)
event.onmemorywrite(enemyDeathWatcher, addMarioState)
event.onmemorywrite(pitDeathWatcher, addDeathMusic)

while true do
    --if an address is changed too often, an event handler will slow down the game
    --so for those problematic addresses, we manually check those addresses every X number of frames
    local frame = emu.framecount()
    if frame % 10 == 0 then
        jumpWatcher()
    end
    emu.frameadvance();
end