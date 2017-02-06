
window.addEventListener('load', () => {
  let master;
  const pong = new Pong();
  const client = mqtt.connect('mqtt://localhost:1884');

  client.on('error', console.error);

  client.on('connect', () => {
    client.subscribe('ball/acceleration');
    client.subscribe('ball/positions');
    client.subscribe('whoami');
  });

  client.on('message', (topic, payload) => {
    const message = payload.toString();

    if (topic === 'whoami') {
      master = message === client.options.clientId;
      client.unsubscribe('whoami');
      console.log('you are ' + (master ? '' : 'not ') + 'master');
    }

  });
});
