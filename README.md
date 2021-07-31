# VTStudio Linker SMB1

## Description
This is a collection of tools that read the memory of Super Mario Bros. 1 via Bizhawk's Lua API, generate a VTubeStudio API call, and send it to VTS.

## Requirements
* Node.js
* The Bizhawk emulator
* A VTubeStudio beta version with API support
* In vtsConnector.js, edit the "const hairColor" and "const eyeColor" lines to contain the names of the artmeshes in your avatar that you want to be used for normal color changes.

## Usage
1. Open VTubeStudio.
2. Start up the main entry point by running "node hawk-connector.js".
3. Start Bizhawk with the command line flags needed to connect to the server (see "start mario1.bat" as an example).
4. At this point, VTubeStudio should prompt you to authorize the API client. You must do so before continuing.
5. If you haven't already done so via the command line or the console, open up Bizhawk's Lua console and load "mario1.lua".
6. Now everything should work!
7. If the hawk-connector server is closed for any reason, then you will need to close Bizhawk and repeat steps 2-5 to re-establish the connection.
