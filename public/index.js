
window.addEventListener('load', () => {
  let master;
  const $status = document.querySelectorAll('.status');
  const pong = new Pong();
  const client = mqtt.connect('mqtt://10.99.3.69:1884');

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
          $status[1].innerHTML = 'ready&nbsp;&nbsp;';
        } else {
          $status[0].innerHTML = 'ready&nbsp;&nbsp;';
        }

        break;
      case 'start':
        setTimeout(() => pong.start(client, master), 2000);

        client.unsubscribe('start');
        $status[0].style.display = $status[1].style.display = 'none';
        break;
    }
  });
});
