class Pong {
  constructor() {
    this.padArea = screen.width / 3;
    this.ball = new Ball(document.querySelector('.ball'));
    this.leftPad = new Pad(document.querySelector('.pad.left'));
    this.rightPad = new Pad(document.querySelector('.pad.right'), '38', '40');

    this.tick();
  }

  checkCollisions() {
    if (this.ball.posX <= -(this.padArea) && this.ball.posX < 0) {
        if (areElementsOverlaping(this.leftPad.$element, this.ball.$element)) {
          this.emit('padcollision');
        }
    } else if (this.ball.posX >= (this.padArea) && this.ball.posX > 0) {
      debounce(() => {
        if (areElementsOverlaping(this.rightPad.$element, this.ball.$element)) {
          this.emit('padcollision');
        }
      }, 32);
    }
  }

  tick() {
    this.emit('update');
    this.checkCollisions();

    requestAnimationFrame(this.tick.bind(this));
  }

  emit(name, data) {
    window.dispatchEvent(new Event(name, data));
  }
}
