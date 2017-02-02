
class Game() {
  tick(time) {
    window.dispatchEvent(new Event('update'));
    requestAnimationFrame(this.tick.bind(this));
  }
}
