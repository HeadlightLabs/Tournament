import request from 'superagent';

export function fetchData() {
  const url = 'https://headlight-tournament-4.herokuapp.com';
  return Promise.all([
    request.get(`${url}/bots`),
    request.get(`${url}/nodes`),
  ])
    .then(data => {
      const bots = JSON.parse(data[0].text).Bots;
      const nodes = JSON.parse(data[1].text).Nodes;
      return {
        bots,
        nodes
      };
    });
}
