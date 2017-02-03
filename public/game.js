class Pong {
  constructor() {
    const $container = document.querySelector('.container');
    const BALL_SIZE = 30;

    this.$scores = document.querySelectorAll('.container h1');

    this.points = { left: 0, right: 0 };
    this.padArea = screen.width / 3;
    this.yBounds = ($container.clientHeight / 2) - (BALL_SIZE / 2);
    this.xBounds = ($container.clientWidth / 2) - (BALL_SIZE / 2);

    this.ball = new Ball(document.querySelector('.ball'));
    this.leftPad = new Pad(document.querySelector('.pad.left'));
    this.rightPad = new Pad(document.querySelector('.pad.right'), 38, 40);

    this.lastRequest = requestAnimationFrame(this.tick.bind(this));

    window.addEventListener('keyup', (e) => {
      if (e.which === 80 && !this.paused) {
        this.pause();
      } else if (this.paused) {
        this.tick();
      }
    });

    this.client = mqtt.connect('mqtt://10.99.3.69:1884');
    this.client.on('error', console.log);

    this.client.on('connect', () => {
      this.client.subscribe('ball/acceleration');
      this.client.subscribe('ball/positions');
      this.client.subscribe('master');
    });

    this.client.on('message', (topic, payload) => {
      const message = payload.toString();

      switch (topic) {
        case 'ball/acceleration':
          const [aX, aY] = message.split(',').map(val => parseInt(val));
          this.ball.acceleration = { x: aX, y: aY };
          break;
        case 'ball/positions':
          const parts = message.split(',');
          this.ball.posX = parts[0] >> 0;
          this.ball.posY = parts[1] >> 0;
          break;
        case 'master':
          this.ball.master = message === this.client.options.clientId;
          this.client.publish(
            'ball/acceleration',
            `${this.ball.acceleration.x},${this.ball.acceleration.y}`,
            () => this.client.unsubscribe(['master', 'ball/acceleration'])
          );
          break;
      }
    });
  }

  checkXCollision() {
    const { $element, goingLeft, posX: x } = this.ball;

    if (x <= -(this.padArea) && goingLeft) {
      if (areElementsOverlapping(this.leftPad.$element, $element)) {
        this.emit('padcollision');
      } else if (x <= -this.xBounds) {
        this.score(goingLeft);
      }
    } else if (x >= (this.padArea) && !goingLeft) {
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
    this.emit('update');

    if (this.ball.master) {
      setTimeout(this.checkXCollision.bind(this), 0);
      setTimeout(this.checkYCollision.bind(this), 0);
      
      this.client.publish('ball/positions', (this.ball.posX + ',' + this.ball.posY));
    }

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
