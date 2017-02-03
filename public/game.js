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

    // window.addEventListener('blur', this.pause.bind(this));
    window.addEventListener('keyup', (e) => {
      if ((e.keyCode || e.which) === 80 && !this.paused) {
        this.pause();
      } else if (this.paused) {
        this.tick();
      }
    });

    requestAnimationFrame(this.tick.bind(this));

    this.client = mqtt.connect('mqtt://localhost:1884');
    this.client.on('error', console.log);

    this.client.on('connect', () => {
      this.client.subscribe('game');
    });

    this.client.on('message', (topic, message) => {
      const [posX, posY, aX, aY] = message.toString().split(',').map(val => parseInt(val));

      if (this.ball.posX !== posX && this.ball.posY !== posY) {
        this.ball.posX = posX;
        this.ball.posY = posY;
        this.ball.acceleration = { x: aX, y: aY };
      }
    });
  }

  checkXCollision() {
    const { $element, goingLeft, posX: x } = this.ball;

    if (x <= -(this.padArea) && goingLeft) {
      if (areElementsOverlaping(this.leftPad.$element, $element)) {
        this.emit('padcollision');
      } else if (x <= -this.xBounds) {
        this.score(goingLeft);
      }
    } else if (x >= (this.padArea) && !goingLeft) {
      if (areElementsOverlaping(this.rightPad.$element, $element)) {
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
    if (goingLeft) {
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
    this.client.publish('game', `${this.ball.posX},${this.ball.posY},${this.ball.acceleration.x},${this.ball.acceleration.y}`);
    setTimeout(this.checkXCollision.bind(this), 0);
    setTimeout(this.checkYCollision.bind(this), 0);

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
