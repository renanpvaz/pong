class Pong {
  constructor() {
    const $container = document.querySelector('.container');
    const BALL_SIZE = 30;

    this.$scores = document.querySelectorAll('.container h1');

    this.points = { left: 0, right: 0 };
    this.client = {};
    this.padArea = screen.width / 3;
    this.yBounds = ($container.clientHeight / 2) - (BALL_SIZE / 2);
    this.xBounds = ($container.clientWidth / 2) - (BALL_SIZE / 2);
  }

  start(client, isMaster) {
    this.client = client;
    this.master = isMaster;
    this.ball = new Ball(document.querySelector('.ball'), isMaster);

    if (!isMaster) {
      client.subscribe('ball/acceleration');
      client.subscribe('ball/positions');
    }

    client.on('message', this.onMessage.bind(this));

    this.createPads();
    this.lastRequest = requestAnimationFrame(this.tick.bind(this));

    window.addEventListener('keyup', (e) => {
      if (e.which === 80 && !this.paused) {
        this.pause();
      } else if (this.paused) {
        this.tick();
      }
    });
  }

  onMessage(topic, payload) {
    const message = payload.toString();

    switch (topic) {
      case 'ball/acceleration':
        const [aX, aY] = message.split(',').map(val => parseInt(val));
        this.ball.acceleration = { x: aX, y: aY };
        this.client.unsubscribe('ball/acceleration');
        break;
      case 'ball/positions':
        const parts = message.split(',');
        this.ball.posX = parts[0] >> 0;
        this.ball.posY = parts[1] >> 0;
        break;
      case 'leftpad/position':
        this.leftPad.posY = parseInt(message || '0');
        break;
      case 'rightpad/position':
        this.rightPad.posY = parseInt(message || '0');
        break;
    }
  }

  createPads() {
    const side = this.master ? 'right' : 'left' ;

    this.client.subscribe(`${side}pad/position`);
    this.leftPad = new Pad(document.querySelector('.pad.left'), {}, this.master);
    this.rightPad = new Pad(document.querySelector('.pad.right'), { up: 38, down: 40 }, !this.master);
  }

  checkXCollision() {
    const { $element, goingLeft, posX: x } = this.ball;

    if (x <= -(this.padArea)) {
      if (areElementsOverlapping(this.leftPad.$element, $element)) {
        this.emit('padcollision');
      } else if (x <= -this.xBounds) {
        this.score(goingLeft);
      }
    } else if (x >= this.padArea) {
      if (areElementsOverlapping(this.rightPad.$element, $element)) {
        this.emit('padcollision');
      } else if (x >= this.xBounds) {
        this.score(goingLeft);
      }
    }
  }

  checkYCollision() {
    const { posY: y, goingLeft } = this.ball;

    if ((y >= this.yBounds) || (y <= -this.yBounds)) {
      this.emit('boundcollision');
    }
  }

  score(goingLeft) {
    if (!goingLeft) {
      this.points.left++;
      this.$scores[0].textContent = this.points.left;
    } else {
      this.points.right++;
      this.$scores[1].textContent = this.points.right;
    }

    this.ball.respawn('score');
  }

  tick() {
    this.paused = false;

    if (this.ball.master) {
      setTimeout(this.checkXCollision.bind(this), 0);
      setTimeout(this.checkYCollision.bind(this), 0);

      this.client.publish('ball/positions', (this.ball.posX + ',' + this.ball.posY));
      this.client.publish('leftpad/position', this.leftPad.posY);
    } else {
      this.client.publish('rightpad/position', this.rightPad.posY);
    }

    this.emit('update');
    this.lastRequest = requestAnimationFrame(this.tick.bind(this));
  }

  pause() {
    this.paused = true;
    cancelAnimationFrame(this.lastRequest);
  }

  emit(name) {
    window.dispatchEvent(new Event(name));
  }
}
