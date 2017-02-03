class Ball {
  constructor($element) {
    this.acceleration = this.getRandomAcceleration();

    this.goingLeft = this.acceleration.x < 0;
    this.posY = 0;
    this.posX = 0;
    this.$element = $element;
    this.master = true;

    window.addEventListener('update', this.update.bind(this));
    window.addEventListener('padcollision', debounce(() => this.invert('x'), 100, true));
    window.addEventListener('boundcollision', debounce(() => this.invert('y'), 100, true));
  }

  invert(dimension) {
    this.acceleration[dimension] = this.acceleration[dimension] * (-1);
    this.goingLeft = this.acceleration.x < 0;
  }

  getRandomAcceleration() {
    return {
      y: 5 * (Math.round(Math.random()) || -1),
      x: 5 * (Math.round(Math.random()) || -1)
    };
  }

  respawn() {
    this.posY = 0;
    this.posX = 0;
    this.acceleration.y = 0;
    this.acceleration.x = 0;

    setTimeout(() => {
      this.acceleration = this.getRandomAcceleration();
      this.goingLeft = this.acceleration.x < 0;
    }, 2001);
  }

  update() {
    if (this.master) {
      this.posY += this.acceleration.y;
      this.posX += this.acceleration.x;
    }

    moveElement(this.$element, this.posY, this.posX);
  }
}
