request = require('./request');

// Global vars
var botStatus = null; // The status of our bot
var activeRequest = false; // Whether we have an outstanding request, so we don't double send.
var rightBorder = 100; // cannot move further right than this
var leftBorder = 0; // cannot move further left than this
var topBorder = 100; // cannot move further up than this
var bottomBorder = 0; // cannot move further down than this
var scanRange = 2; // scan radius = 2, since scan returns 5x5 area centered on bot
var claimLimit = 3; // maximum number of nodes that can be claimed at once
var claims = []; // currently claimed nodes
var scanned = []; // currently scanned nodes

function updateStatus(newStatus) {
  if (!newStatus) {
    console.log(`[ERROR] Bad response: ${newStatus}`)
    return;
  }

  status = JSON.parse(newStatus);
  if (!status.Status) {
    console.log(`[ERROR] Couldn't parse new status: ${status}`);
    return;
  }
  console.log(`[INFO] Updating with new status: ${newStatus}`)
  botStatus = status.Status;
}

function printBotStatus() {
  if (!botStatus) return;
  
  var tmpl = `
    == STATUS ==
    Callsign: ${botStatus.Id}
    Claims: ${botStatus.Claims}
    Location (X,Y): (${botStatus.Location.X},${botStatus.Location.Y})
    Score ${botStatus.Score}
  `;
  console.log(tmpl);
}

// Registers our bot with the server
function register(callsign) {
  let path = "/register"
  let data = {
    callsign: callsign
  };
  return request.sendRequest(path, data);
}

// Scans the area for nodes
function scan() {
  let path = "/scan"
  let data = {
    callsign: botStatus.Id
  }
  return request.sendRequest(path, data);
}

// Claims a node
function claim(node){
  let path = "/claim";
  let data = {
    callsign: botStatus.Id,
    node: node.Id
  }
  return request.sendRequest(path, data);
}

// Mine a node for points
function mine(node){
  let path = "/mine";
  let data = {
    callsign: botStatus.Id,
    node: node.Id
  }
  return request.sendRequest(path,data);
}

// Sends a move request to the server
function moveTo(x, y) {
  let path = "/move"
  let data = {
    callsign: botStatus.Id,
    x: x + "",
    y: y + ""
  }
  return request.sendRequest(path, data);
}

// function to move by an amount relative to current position
function moveBy(x,y){
  let newX = botStatus.Location.X + x;
  let newY = botStatus.Location.Y + y;
  
  console.log(`Moving from (${botStatus.Location.X},${botStatus.Location.Y}) to (${newX}, ${newY})`); 
  return moveTo(newX, newY);
}

// Closure containing methods that drive bot towards the origin (bottom left)
function ToOrigin(botStatus){
  // establish target position
  let targetX = leftBorder + scanRange + 1;
  let targetY = bottomBorder + scanRange + 1;
  let reachedOrigin = false; // flag to be set when bot reaches origin

  function move(){
    // get bot's current position
    let currentX = parseInt(botStatus.Location.X);
    let currentY = parseInt(botStatus.Location.Y);
    // compute the distance to target position
    let moveX = targetX - currentX;
    let moveY = targetY - currentY;
    // normalize movement vector, since bot can only move a max of 1 square in any direction
    moveX /= Math.max(Math.abs(moveX), 1);
    moveY /= Math.max(Math.abs(moveY), 1);
    return moveBy(moveX,moveY);
  }

  // function to check if the given position is equal to the origin
  function checkOrigin(x,y){
    let check = (x == targetX) && (y == targetY);
    if (check) reachedOrigin = true;
    return check;
  }

  // return the move and checkOrigin functions
  return {
    move,
    checkOrigin,
    reachedOrigin: () => reachedOrigin
  };
}

// Closure returning methods to sweep the grid
function Sweeper(botStatus){
  // how it works:
  // this will attempt to move the bot to the right edge of the grid
  // if it reaches the right edge, it will move the bot up by 5 squares,
  // then move it left until it reaches the left edge.
  // then up again, then right, then up, left, up, right... and so on.
  let direction = "right"; // which direction is the bot currently moving
  // switchedUpAt is the last y coordinate at which direction changed to "up"
  let switchedUpAt = parseInt(botStatus.Location.Y);
  function move(){
    // get current bot position
    let currentX = parseInt(botStatus.Location.X);
    let currentY = parseInt(botStatus.Location.Y);
    // declare variables to indicate movement direction
    let moveX, moveY;
    // assign moveX and moveY based on direction
    switch(direction) {
      case "right":
        // if bot is as far right as it can go,
        if (currentX == rightBorder - scanRange - 1){
          // set direction to up instead,
          direction = "up";
          switchedUpAt = currentY;
          // call the move function again, with the new direction
          return move();
        }
        // otherwise, set bot to move right
        moveX = 1;
        moveY = 0;
        break;
      case "up":
        // if either bot is as far up as it can go,
        // or it's moved up by the entire width of one scan area,
        if (currentY == topBorder - scanRange - 1 ||
            currentY - switchedUpAt == scanRange * 2 + 1
        ){
          // set direction to left, if the bot is at the right edge,
          // or right, if the bot is at the left edge
          direction = (currentX == rightBorder - scanRange - 1) ? "left" : "right";
          // call move again, with new direction
          return move();
        }
        // otherwise, set bot to move up
        moveX = 0;
        moveY = 1;
        break;
      case "left":
        // if bot is as far left as it can go,
        if (currentX == leftBorder + scanRange + 1){
          // set direction to up instead,
          direction = "up";
          switchedUpAt = currentY;
          // call the move function again, with the new direction
          return move();
        }
        // otherwise, set bot to move left
        moveX = -1;
        moveY = 0;
        break;
    }
    // the switch statement took care of all conditional logic,
    // now the moveX and moveY variables have been properly set
    return moveBy(moveX,moveY);
  }

  // return object containing move function, as well as getter method for direction
  return {
    move,
    getDirection: () => direction
  };
}

// function to retrieve the next valid claim from scanned nodes
// this function will try to claim a node from the scanned list
// it will keep trying until scanned list becomes empty
function nextClaim(){
  let claimed;
  if (scanned.length){
    // try to claim the last node in scanned list
    let node = scanned.pop();
    claim(node).then((strResponse) => {
      data = JSON.parsed(strResponse);
      if (!data.Error){
        updateStatus(strResponse);
        claimed = node;
      } else {
        // try to get the next node
        claimed = nextClaim();
      }
    }).catch((error) => {
      console.log("[ERROR] Error with register request: ", error);
    })
  }
  return claimed;
}

// these are the "driver" objects for our bot
// they will be initialized after the bot is registered
var toOrigin;
var sweeper;

// Runs our bot!
function run() {
  // Print our currently known status
  printBotStatus();

  // Don't do anything if we have an active request out
  if (activeRequest) {
    console.log("Active request, not doing anything.");
    return;
  }

  // Have we registered? If not, let's do that first.
  if (!botStatus) {
    console.log("Registering...");
    activeRequest = true;
    register("zia_bot_9000").then( (strResponse) => {
      updateStatus(strResponse);
    }).catch( (error) => {
      console.log("[ERROR] Error with register request: ", error);
    }).then(() => {
      // once we've registered, we can initialize the drivers
      // obtain ToOrigin object, used to move bot towards origin point
      toOrigin = ToOrigin(botStatus);
      // obtain Sweeper object, used to move bot in a snake-like sweeping pattern
      // to cover entire grid
      sweeper = Sweeper(botStatus);
      activeRequest = false;
    });
    return;
  }

  // if we have some nodes scanned and haven't reached our claim limit,
  // try to claim a node
  if (scanned.length > 0 && claims.length < claimLimit){
    let claim = nextClaim(scanned);
    // if a valid claim was made, add it to the claims array
    if (claim) {
      claims.push(claim);
      return;
    }
  }

  // if we have any nodes claimed, mine one
  if (claims.length){
    let node = claims[0];
    mine(node).then((strResponse) => {
      updateStatus(strResponse);
      // if node had value of 1, now it is empty
      if (node.value == 1){
        // remove it from the claims list
        claims.shift();
      }
    }).catch((error) => {
      console.log("[ERROR] Error with move request: ", error);
    })
    // return from run, if we mined a node we don't move
    return;
  }

  // If bot hasn't reached origin yet, move it towards origin
  if (!toOrigin.reachedOrigin()){
    console.log("Moving towards origin...");
    activeRequest = true;
    toOrigin.move().then( (strResponse) => {
      updateStatus(strResponse);
    }).catch( (error) => {
      console.log("[ERROR] Error with move request: ", error);
    }).then(() => {
      console.log("Scanning...");
      return scan();
    }).then((response) => {
      let data = JSON.parse(response);
      if (data.Nodes.length > 0){
        // new nodes scanned, add them to scanned array
        scanned.concat(data.Nodes);
      }
    }).catch((error) => {
      console.log("[ERROR] Error with scan request: ", error);
    }).then(() => {
      // check if we've reached the origin
      if (toOrigin.checkOrigin(botStatus.Location.X,botStatus.Location.Y)){
        console.log("reached origin");
      }
      activeRequest = false;
    })
  } // end if(!toOrigin.reachedOrigin())
  else {
    debugger;
    // bot has already reached the origin,
    // move it in the sweeping pattern
    activeRequest = true;
    sweeper.move().then( (strResponse) => {
      console.log(`Moving ${sweeper.getDirection()}...`);
      updateStatus(strResponse);
    }).catch( (error) => {
      console.log("[ERROR] Error with move request: ", error);
    }).then(() => {
      console.log("Scanning...");
      return scan();
    }).then((response) => {
      let data = JSON.parse(response);
      console.log(data.Nodes);
      if (data.Nodes.length > 0){
        // new nodes scanned, add them to scanned array
        scanned.concat(data.Nodes);
      }
    }).catch((error) => {
      console.log("[ERROR] Error with scan request: ", error);
    }).then(() => {
      activeRequest = false;
    })
  }
}

// Run every 1000 ms
var running = setInterval(run, 100);
