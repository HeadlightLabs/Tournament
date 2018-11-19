console.log("js scripts loaded");

//api variables
let nodeApi = "https://headlight-tournament-4.herokuapp.com/nodes";
let botApi = "https://headlight-tournament-4.herokuapp.com/bots";

//to test for scale
const gsize = 20; //for a 20x20 grid
const gridSize = 600; //for a 600px grid
const perNode = gridSize / gsize; //size for each bot and node

//Bot Api call
var createBots = new XMLHttpRequest();
createBots.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var data = JSON.parse(this.responseText);
    }

    for (i = 0; i < data.Bots.length; i++) {
        var newDiv = document.createElement("div");
        newDiv.setAttribute(
            "style",
            `
    left: ${data.Bots[i].Location.X * perNode}px;
    bottom: ${data.Bots[i].Location.Y * perNode}px;
    `
        );
        newDiv.setAttribute("class", "bot");
        newDiv.setAttribute("id", data.Bots[i].Id);
        newDiv.setAttribute(
            "onClick",
            `
    document.getElementById('botinfo').innerHTML="<h4>BOT INFO</h4><b>${
        data.Bots[i].Id
    }</b><br>Number of Claims: ${data.Bots[i].Claims.length} <br>Score: ${
                data.Bots[i].Score
            } <br>";
    `
        );

        document.getElementById("main-grid").appendChild(newDiv);
    }
};
createBots.open("GET", botApi, true);
createBots.send();

//Nodes Api call
var createNodes = new XMLHttpRequest();
createNodes.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var data = JSON.parse(this.responseText);
    }

    for (i = 0; data.Nodes.length; i++) {
        var newDiv = document.createElement("div");
        newDiv.setAttribute(
            "style",
            `
      left: ${data.Nodes[i].Location.X * perNode}px;
      bottom: ${data.Nodes[i].Location.Y * perNode}px;
      `
        );
        newDiv.setAttribute("class", "node");
        newDiv.setAttribute("id", "node" + i);
        newDiv.setAttribute(
            "onClick",
            `
      document.getElementById('nodeinfo').innerHTML="<h4>NODE INFO</h4>Node Value: ${
          data.Nodes[i].Value
      }</b><br>Claimed By: ${data.Nodes[i].ClaimedBy} <br>";
      `
        );

        document.getElementById("main-grid").appendChild(newDiv);
    }
};
createNodes.open("GET", nodeApi, true);
createNodes.send();

//to update - still working on this.
setInterval(function() {
    var updateBotsCall = new XMLHttpRequest();
    updateBotsCall.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
        }

        for (i = 0; i < data.Bots.length; i++) {
            var botNode = document.getElementById(data.Bots[i].Id);
            botNode.setAttribute(
                "style",
                `
      left: ${data.Bots[i].Location.X * perNode}px;
      bottom: ${data.Bots[i].Location.Y * perNode}px;
      `
            );
        }
    };
    updateBotsCall.open("GET", botApi, true);
    updateBotsCall.send();
}, 1000);
