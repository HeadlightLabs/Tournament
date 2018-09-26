const http = require('http');
const process = require('process');

// Handles the guts of actually sending the HTTP request
function sendRequest(path, data) {
  data = JSON.stringify(data);
  const options = {
    hostname: "headlight-tournament-1.herokuapp.com",
    path: path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  var response = [];

  return new Promise((resolve, reject) => {
    req = http.request(options, (res) => {
      res.setEncoding('utf8');
      res.on('data', (chunk) => { response.push(chunk); });
      res.on('end', () => {
        resolve(response.join(''));
      });
    });


    req.on('error', (e) => {
      reject(e);
    });

    req.write(data);
    req.end();
  });
}

exports.sendRequest = sendRequest;
