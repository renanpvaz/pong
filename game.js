class Pong {
  constructor() {
    this.ball = new Ball(document.querySelector('.ball'));
    this.tick();
  }

  tick() {
    window.dispatchEvent(new Event('update'));
    requestAnimationFrame(this.tick.bind(this));
  }
}
