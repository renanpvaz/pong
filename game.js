class Pong {
  constructor() {
    const $container = document.querySelector('.container');
    const BALL_SIZE = 30;

    this.points = { left: 0, right: 0 };
    this.padArea = screen.width / 3;
    this.yBounds = ($container.clientHeight / 2) - (BALL_SIZE / 2);
    this.xBounds = ($container.widthHeight / 2) - (BALL_SIZE / 2);

    this.ball = new Ball(document.querySelector('.ball'));
    this.leftPad = new Pad(document.querySelector('.pad.left'));
    this.rightPad = new Pad(document.querySelector('.pad.right'), 38, 40);

    this.tick();
  }

  checkXCollision() {
    const { $element, goingLeft, posX: x } = this.ball;

    if (x <= -(this.padArea) && goingLeft) {
      if (areElementsOverlaping(this.leftPad.$element, $element)) {
        this.emit('padcollision');
      }
    } else if (x >= (this.padArea) && !goingLeft) {
      if (areElementsOverlaping(this.rightPad.$element, $element)) {
        this.emit('padcollision');
      } else if ((x >= this.xBounds && !goingLeft) || (x <= -this.xBounds && goingLeft)) {
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
      this.poins.left++;
    } else {
      this.poins.right++;
    }
  }

  tick() {
    this.emit('update');
    setTimeout(this.checkXCollision.bind(this), 0);
    setTimeout(this.checkYCollision.bind(this), 0);

    requestAnimationFrame(this.tick.bind(this));
  }

  emit(name, data) {
    window.dispatchEvent(new Event(name, data));
  }
}
