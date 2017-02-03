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

server.on('clientConnected', (client) => {
  pino.info('client connected', client.id);
});

server.on('subscribed', (topic, client) => {
  if (!topics.waiting) {
    topics.waiting = client;
    pino.info('left player is waiting');
  } else {
    topics.games[topics.waiting.id] = {
      left: topics.waiting,
      right: client
    };

    pino.info('game created');

    delete topics.waiting;
  }
});
