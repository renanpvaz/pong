class Ball {
  constructor($element) {
    const translate = getTranslate($element);

    this.acceleration = {
      y: 5,
      x: 5
    };

    this.posY = translate.y;
    this.posX = translate.x;
    this.$element = $element;

    window.addEventListener('update', this.update.bind(this));
    window.addEventListener('padcollision', debounce(() => this.invert('x'), 100, true));
    window.addEventListener('boundcollision', debounce(() => this.invert('y'), 100, true));
  }

  invert(dimension) {
    this.acceleration[dimension] = this.acceleration[dimension] * (-1);
  }

  update() {
    this.posY += this.acceleration.y;
    this.posX += this.acceleration.x;

    moveElement(this.$element, this.posY, this.posX);
  }
}
