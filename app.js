httpService = require('./http-service');
_ = require('lodash');

MIN_X = 0;
MIN_Y = 0;
MAX_X = 100;
MAX_Y = 100;

/**
 * This is the bot format
 *  {"Status":{"Claims":[],"Id":"","Location":{"X":0,"Y":0},"Score":0},"Nodes":null,"Error":false,"ErrorMsg":""}
 */
bot = null;

claimed = {};

/**
 * This map is used to keep track of everything I have scanned
 */
marsMap = [...Array(MAX_X)].map(e => Array(MAX_Y));

/**
 * This is my registration function.
 * It is needed for starting the sim
 */

function register() {
    let path = '/register';
    let data = {callsign: 'waveyPavey'};
    httpService.sendRequest(path, data).then((response) => {
        const parsed = JSON.parse(response);

        if (parsed.Error) {
            console.log("[ERROR] Registration Failed! ", parsed.ErrorMsg);
            return;
        } 
        
        console.log('Registraion Success! ', response);
        bot = parsed;
    }).catch( (error) => {
        console.log("[ERROR] Registration Failed! ", error);
    });
}

/**
 * This is my move function.
 * Used to move my bot places
 */
function move(x, y) {
    let path = '/move';
    let data = {
        callsign: bot.Status.Id,
        x: _.toString(x),
        y: _.toString(y)
    }
    httpService.sendRequest(path, data).then((response) => {
        const parsed = JSON.parse(response);
        
        if (parsed.Error) {
            console.log("[ERROR] Move Failed! ", parsed.ErrorMsg);
            return;
        } 

        console.log('Move Success! ', response);
        bot = parsed;
       
    }).catch( (error) => {
        console.log("[ERROR] Move Failed! ", error);
    });
}

/**
 * This is my scan function.
 * Scans things around my bot for 5X5 blocks away
 */
function scan() {
    let path = '/scan';
    let data = {callsign: bot.Status.Id};
    return httpService.sendRequest(path, data).then((response) => {
        const parsed = JSON.parse(response);
        
        if (parsed.Error) {
            console.log("[ERROR] Scan Failed! ", parsed.ErrorMsg);
            return;
        } 

        bot = parsed;
        console.log('Scan Success! ', response);
        // gotta update map
        _.forEach(bot.Nodes, (node) => {
            marsMap[node.Location.X][node.Location.Y] = {
                Id : node.Id,
                Value: node.Value,
                Claimed: node.Claimed
            }
        });
    }).catch( (error) => {
        console.log("[ERROR] Scan Failed! ", error);
    });
}

/**
 * This is my claim node function. Use to claim nodes that have been scanned
 * @param {string} node 
 */
function claim(node) {
    let path = '/claim';
    let data = {
        callsign: bot.Status.Id,
        node: node
    };
    return httpService.sendRequest(path, data);
}

/**
 * This is my release node function. Used to release claimed nodes that I do not need anymore
 * @param {string} node 
 */
function release(node) {
    let path = '/release';
    let data = {
        callsign: bot.Status.Id,
        node: node
    };
    return httpService.sendRequest(path, data);
}

/**
 * This is my mine node function. Used to mine a claimed node.
 * @param {string} node 
 */
function mine(node) {
    let path = '/mine';
    let data = {
        callsign: bot.Status.Id,
        node: node
    };
    return httpService.sendRequest(path, data);
}

/**
 * Should I Scan function. Determine if you need to scan based on location and map
 */
function shouldIScan() {
    let shouldI = false;
    const botX = bot.Status.Location.X;
    const botY = bot.Status.Location.Y;
    const startX = (botX - 5 < MIN_X) ? MIN_X : botX - 5;
    const startY = (botY - 5 < MIN_Y) ? MIN_Y : botY - 5;
    const endX = (botX + 5 > MAX_X) ? MAX_X : botX + 5;
    const endY = (botY + 5 > MAX_Y) ? MAX_Y : botY + 5;
    for (let x = startX; x <= endX; x++) {
        for(let y = startY; y <= endY; y++) {
            if (typeof marsMap[x][y] === 'undefined' || marsMap[x][y] === null) {
                shouldI = true;
            }
            marsMap[x][y] = {};
        }
    }

    return shouldI;
}

/**
 * Are there any unclaimed around me?
 */
function areThereAnyToClaim() {
    const unclaimedNode = _.find(bot.Nodes, (node) => !node.Claimed && node.Value > 0);

    return typeof unclaimedNode !== 'undefined';
}

/**
 * Claim one around me
 */
function claimOneAroundMe() {
    const unclaimedNode = _.find(bot.Nodes, (node) => !node.Claimed && node.Value > 0);
    claim(unclaimedNode.Id).then((response) => {
        const parsed = JSON.parse(response);
        
        if (parsed.Error) {
            console.log("[ERROR] Claim Failed! ", parsed.ErrorMsg);
            return;
        } 

        console.log('Claim Success! ', response);
        bot = parsed;
        claimed[unclaimedNode.Id] = unclaimedNode;
    }).catch((error) => console.log("[ERROR] Claim Failed! ", error));
}

/**
 * Can I Mine any?
 */
function canIMine() {
    const minable = _.find(claimed, (node) => node.Value > 0);
    return typeof minable !== 'undefined';
}

/**
 * Mine one of my claimed nodes
 */
function mineAClaimedNode() {
    const minable = _.find(claimed, (node) => node.Value > 0);

    mine(minable.Id).then((response) => {
        const parsed = JSON.parse(response);
        
        if (parsed.Error) {
            console.log("[ERROR] Mine Failed! ", parsed.ErrorMsg);
            return;
        } 
        console.log('Mine Success! ', response);
        bot = parsed;
        // update temp list
        claimed[minable.Id] = _.find(bot.Nodes, (node) => _.isEqual(node.Id, minable.Id));
    }).catch((error) => console.log("[ERROR] Mine Failed! ", error));
}

/**
 * Are there any empty mines in my bank
 */
function anyEmptyMine() {
    const empty = _.find(claimed, (node) => node.Value === 0);
    return typeof empty !== 'undefined';
}

/**
 * Release any empty mines in my bank
 */
function releaseEmptyMine() {
    const empty = _.find(claimed, (node) => node.Value === 0);

    release(empty.Id).then((response) => {
        const parsed = JSON.parse(response);
        
        if (parsed.Error) {
            console.log("[ERROR] Release Failed! ", parsed.ErrorMsg);
            return;
        } 

        console.log('Release Success! ', response);
        bot = parsed;
        delete claimed[empty.Id];
    }).catch((error) => console.log("[ERROR] Release Failed! ", error));
}

/**
 * Calculate where to move to
 */
function doAMove() {
    // lets start east, south, west, then north
    const botX = bot.Status.Location.X;
    const botY = bot.Status.Location.Y;

    if(botX + 6 < MAX_X && typeof marsMap[botX + 6][botY] === 'undefined') {
        console.log('Move East');
        move(botX + 1, botY);
    } else if (botY + 6 < MAX_Y && typeof marsMap[botX][botY + 6] === 'undefined') {
        console.log('Move South');
        // lets move south
        move(botX, botY + 1);
    } else if (botX - 6 > MIN_X && typeof marsMap[botX - 6][botY] === 'undefined') {
        console.log('Move West');
        // lets move west
        move(botX - 1, botY);
    } else if ((botY - 6 > MIN_Y && typeof marsMap[botX][botY - 6] === 'undefined')){
        console.log('Move North');
        // lets move north
        move(botX, botY - 1);
    } else {
        console.log('I cant move any more');
        clearInterval(myIntervalRun);
    }
    
}

/**
 * This is my init function. Call this to start the process
 */
function init() {
    switch(true)  {
        case bot === null:
            register();
            break;
        case shouldIScan():
            scan();
            break;
        case areThereAnyToClaim():
            claimOneAroundMe();
            break;
        case canIMine():
            mineAClaimedNode();
            break;
        case anyEmptyMine(): 
            releaseEmptyMine();
            break;
        default:
            doAMove();
    }
}

// set at 200 so I don't break any server and I don't need to go fast right now
myIntervalRun = setInterval(init, 200);