class Pong {
  constructor() {
    this.padArea = screen.width / 3;
    this.yBounds = (document.querySelector('.container').clientHeight / 2) - 15;

    this.ball = new Ball(document.querySelector('.ball'));
    this.leftPad = new Pad(document.querySelector('.pad.left'));
    this.rightPad = new Pad(document.querySelector('.pad.right'), 38, 40);

    this.tick();
  }

  checkXCollision() {
    const x = this.ball.posX;

    if (x <= -(this.padArea) && x < 0) {
      if (areElementsOverlaping(this.leftPad.$element, this.ball.$element)) {
        this.emit('padcollision');
      }
    } else if (x >= (this.padArea) && x > 0) {
      if (areElementsOverlaping(this.rightPad.$element, this.ball.$element)) {
        this.emit('padcollision');
      }
    }
  }

  checkYCollision() {
    const { posY: y, acceleration } = this.ball;

    if ((y <= -this.yBounds && acceleration.y < 0) || (y >= this.yBounds && acceleration.y > 0)) {
      this.emit('boundcollision');
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
