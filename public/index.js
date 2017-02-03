
window.addEventListener('load', () => {
  let master;
  const pong = new Pong();
  const client = mqtt.connect('mqtt://10.99.3.69:1884');

  client.on('error', console.error);

  client.on('connect', () => {
    client.subscribe('ball/acceleration');
    client.subscribe('ball/positions');
    client.subscribe('whoami');
  });

  client.on('message', (topic, payload) => {
    const message = payload.toString();

    if (topic === 'whoami') {
      master = message === this.client.options.clientId;
      client.unsubscribe('master');
    }

    console.log('you are ' + (master ? '' : 'not') + ' master');
  });
});
