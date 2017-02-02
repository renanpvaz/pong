class Pong {
  constructor() {
    this.ball = new Ball(document.querySelector('.ball'));
    this.leftPad = new Pad(document.querySelector('.pad.left'));
    this.rightPad = new Pad(document.querySelector('.pad.right'), '38', '40');

    this.tick();
  }

  tick() {
    this.emit('update');

    if (areElementsOverlaping(this.leftPad.$element, this.ball.$element)) {
      this.emit('padcollision');
    }

    if (areElementsOverlaping(this.rightPad.$element, this.ball.$element)) {
      this.emit('padcollision');
    }

    requestAnimationFrame(this.tick.bind(this));
  }

  emit(name, data) {
    window.dispatchEvent(new Event(name, data));
  }
}
