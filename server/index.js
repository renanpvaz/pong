const mosca = require('mosca');
const pino = require('pino')();

const http = require('http');
const httpServ = http.createServer();

const server = new mosca.Server({
  port: 1883
});

const topics = {
  games: {}
};

server.attachHttpServer(httpServ);
httpServ.listen(1884);

server.on('ready', () => {
  pino.info(`Server is running at http://localhost:1883`);
});

server.on('subscribed', (topic, client) => {
  if (topic === 'whoami') {
    if (topics.waiting.id === client.id) {
      server.publish({ topic: 'whoami', payload: client.id });
      console.log('left connected - id ' + client.id);
    } else {
      server.publish({ topic: 'whoami', payload: topics.waiting.id });
      console.log('right connected - id ' + client.id);
      delete topics.waiting;
    }
  }
});

server.on('clientConnected', (client) => {
  if (!topics.waiting) {
    topics.waiting = client;
  } else if (topics.waiting.id !== client.id) {
    topics.games[topics.waiting.id] = {
      left: topics.waiting,
      right: client
    };
  }
});
