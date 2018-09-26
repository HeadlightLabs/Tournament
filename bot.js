request = require("./request");

//Global Variables
var botStatus = null;
var ongoingRequest = false;
var currentNodes = false;
var currentNodeValue = 0

function register(callsign){
  let path = "/register"
  let data = {
    callsign: callsign
  };
  return request.sendRequest(path, data)
}

function updateStatus(newStatus){
  status = JSON.parse(newStatus)
  botStatus=status.Status
}

function printBotStatus(){
  if (!botStatus) return;

  let currentStatusPrintout =
  `
  *** STATUS ***
  ID: ${botStatus.Id}
  Claims: ${botStatus.Claims}
  Location (X, Y): ${botStatus.Location.X}, ${botStatus.Location.Y}
  Score: ${botStatus.Score}
  `;

  console.log(currentStatusPrintout);
}

function randomMovement(){
  ongoingRequest = true;
  let xPositionChange = Math.round((Math.random() * 2) - 1);
  let yPositionChange = Math.round((Math.random() * 2) - 1);
  let updatedXPosition = botStatus.Location.X - xPositionChange;
  let updatedYPosition = botStatus.Location.Y - yPositionChange;
  if (moveBot(updatedXPosition, updatedYPosition) !== undefined){
    console.log(`Moving from (${botStatus.Location.X}, ${botStatus.Location.Y}), to (${updatedXPosition}, ${updatedYPosition}).`)
    return moveBot(updatedXPosition, updatedYPosition)
  }
  else {
    console.log(`Bot unable to move.`)
  }
}

// MOVE POST

function moveBot(updatedXPosition, updatedYPosition){
  let path = "/move"
  let data = {
    callsign: botStatus.Id,
    x: updatedXPosition.toString(),
    y: updatedYPosition.toString()
  }
  return request.sendRequest(path, data)
}

// SCAN POST

function scan(){
  let path="/scan"
  let data= {
    callsign: botStatus.Id,
    x: botStatus.Location.X,
    y: botStatus.Location.Y
  };
  return request.sendRequest(path, data)
}

// ANNOUNCING SCAN STATUS

function scanStatus(scanStatus){
  scan = JSON.parse(scanStatus)
  if (scan.Nodes.length > 0){
    console.log("Nodes found!")
    let nodeIds = scan.Nodes.map(node => node.Id)
    currentNodes = nodeIds
  }
  else {
    console.log("No Nodes found!")
    currentNodes = false
  }
}

// POSTING CLAIMS

function claim(){
  let currentNodeClaim = currentNodes.find(node => node === node)
  let path="/claim"
  let data = {
    callsign: botStatus.Id,
    node: currentNodeClaim,
  };
  return request.sendRequest(path, data)
}

// POSTING MINING
function mineNodes(){
  let currentNodeClaim = currentNodes.find(node => node === node)
  let path="/mine"
  let data = {
    callsign: botStatus.Id,
    node: currentNodeClaim,
  }
  return request.sendRequest(path, data)
}

//CONSOLE LOG PIECE OF MINING

function miningStatus(newStatus){
  status = JSON.parse(newStatus)
  botStatus=status.Status
  currentNode = status.Nodes[0]
  currentNodeValue = status.Nodes[0].Value
  console.log("Node Value is: ", currentNode.Value)
}

// RELEASE NODE WHEN EMPTY

function releaseNode(){
  let currentNodeClaim = currentNodes.find(node => node === node)
  let path="/release"
  let data = {
    callsign: botStatus.Id,
    node: currentNodeClaim,
  }
  currentNodes.shift(currentNodeClaim)
  return request.sendRequest(path, data).then(res => console.log())
}





// RUN FUNCTION FOR THE APP
function run(){
  printBotStatus();

  if (ongoingRequest){
    console.log("Request ongoing, gracefully stopping.")
    return;
  }

  // REGISTERING BOT
  if (!botStatus){
    console.log("Registering Bot..");
    ongoingRequest = true;
      register("NEWNOVEMBER")
      .then(res => updateStatus(res))
      .catch((error) => {
        console.log("[ERROR] Error with register request: ", error)
      })
      .then(ongoingRequest = false);
      return;
  }
      // MOVING BOT
  if (currentNodes === false){
    console.log("Moving bot...")
    ongoingRequest = true;
    randomMovement()
    .then(res => updateStatus(res))
    .catch((error) => {
      console.log("[ERROR] Error with movement request: ", error)
    })
    .then(ongoingRequest = false);

    // SCANNING AREA
    console.log("")
    console.log("Scanning...")
    console.log("")
    ongoingRequest = true;
    scan()
    .then(res => scanStatus(res))
    .catch((error) => {
      console.log("[ERROR] Error with scan request: ", error)
    })
    .then(ongoingRequest = false);
  }

  if (currentNodes !== false){
    console.log("")
    console.log("Claiming Nodes...")
    console.log("")
    ongoingRequest = true;
    claim()
    .then(res => updateStatus(res))
    .then(ongoingRequest = false);

  //BEGIN MINING
      console.log("")
      console.log("Mining Nodes...")
      console.log("")
      ongoingRequest = true;
      mineNodes()
      .then(res => miningStatus(res))
      .catch((error) => {
        console.log("[ERROR] Error with mine request: ", error)
      })
      .then(ongoingRequest = false)

  // CONDITIONAL TO REMOVE EMPTY NODES
    // if (currentNodeValue === 0){
    //   console.log("")
    //   console.log("Releasing Empty Node...")
    //   console.log("")
    //   ongoingRequest = true;
    //   releaseNode()
    //   .catch((error) => {
    //     console.log("[ERROR] Error releasing node: ", error)
    //   })
    //     .then(ongoingRequest = false)
    // }

    return;
  }
}

setInterval(run, 1000)
