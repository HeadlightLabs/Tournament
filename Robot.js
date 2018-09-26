const axios = require('axios');

class Robot {
    constructor() {
        this.status = {};

        this.xDirection = false;
        this.yDirection = false;
        this.score = 0;
    }

    register(callsign) {

        return axios.post("http://headlight-tournament-3.herokuapp.com/register", { callsign })
            .then(res => res.data)
            .then(response => {
                this.status = response.Status;
            })
            .catch(err => {
                console.log(err);
            })

    }


    move() {
        //moves robot along x axis.  if y hits 0 or 100 return. if had more time
        //would've implemented further logic
        return axios.post("http://headlight-tournament-3.herokuapp.com/move", {
            callsign: this.status.Id,
            x: this.xDirection ? this.status.Location.X++ + "" : this.status.Location.X-- + "",
            y: this.status.Location.Y + ""
        })
            .then(res => res.data)
            .then(() => {

                if (this.status.Location.X >= 100) {
                    this.xDirection = false;
                    this.status.Location.Y--;
                }
                else if (this.status.Location.X <= 0) {
                    this.xDirection = true;
                    this.status.Location.Y--;
                }

                if (this.status.Location.Y <= 0 || this.status.Location.Y >= 100) {
                    return;
                }

            })
            .catch(err => {
                console.log(err)
            })
    }

    scan() {
        return axios.post("http://headlight-tournament-3.herokuapp.com/scan", {
            callsign: this.status.Id
        })
            .then(res => res.data)
            .then(response => {
                return response.Nodes;
            })
            .catch(err => {
                console.log(err)
            })
    }

    claim(nodeId) {
        return axios.post("http://headlight-tournament-3.herokuapp.com/claim", {
            callsign: this.status.Id,
            node: nodeId
        })
            .then(() => {

            })
            .catch(err => {
                console.log(err)
            })
    }

    mine(nodeId) {
        return axios.post("http://headlight-tournament-3.herokuapp.com/mine", {
            callsign: this.status.Id,
            node: nodeId
        })
            .then(res => res.data)
            .then(response => {
                if (response.Nodes[0].Value === 0) {
                    this.score = response.Status.Score;
                    return response.Status.Score;
                } else {
                    setTimeout(() => { }, 200);
                    return this.mine(nodeId);
                }
            })
            .then(score => {
                this.score = score;
                return score;
            })
            .catch(err => {
                console.log(err)
            })
    }

    release(nodeId) {
        return axios.post("http://headlight-tournament-3.herokuapp.com/release", {
            callsign: this.status.Id,
            node: nodeId
        })
            .then(res => res.data)
            .then(response => {
            })
            .catch(err => {
                console.log(err)
            })
    }
}


module.exports = Robot;