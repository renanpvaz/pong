
window.addEventListener('load', () => {
  let master;
  const pong = new Pong();
  const client = mqtt.connect('mqtt://localhost:1884');

  client.on('error', console.error);

  client.on('connect', () => {
    client.subscribe('whoami');
    client.subscribe('start');
  });

  client.on('message', (topic, payload) => {
    const message = payload.toString();

    switch (topic) {
      case 'whoami':
        master = message === client.options.clientId;
        client.unsubscribe('whoami');

        if (!master) {
          client.publish('start');
        }
        break;
      case 'start':
        pong.start(client, master);
        client.unsubscribe('start');
        break;
    }
  });
});
