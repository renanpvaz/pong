class Ball {
  constructor($element) {
    const translate = getTranslate($element);

    this.acceleration = {
      y: 0,
      x: 5
    };

    this.posY = translate.y;
    this.posX = translate.x;
    this.$element = $element;

    window.addEventListener('update', this.update.bind(this));
    window.addEventListener('padcollision', debounce(this.handleCollision.bind(this), 100, true));
  }

  invert(dimension) {
    this.acceleration[dimension] = this.acceleration[dimension] * (-1);
  }

  checkBoundsCollision() {
    if ((this.posX <= -600 && this.acceleration.x < 0) || (this.posX >= 600 && this.acceleration.x > 0)) {
      this.invert('x');
    }

    if ((this.posY <= -420 && this.acceleration.y < 0) || (this.posY >= 400 && this.acceleration.y > 0)) {
      this.invert('y');
    }
  }

  handleCollision() {
    this.invert('x');
  }

  update() {
    this.posY += this.acceleration.y;
    this.posX += this.acceleration.x;

    this.checkBoundsCollision();

    moveElement(this.$element, this.posY, this.posX);
  }
}
