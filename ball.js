function move($element, y, x) {
  window.requestAnimationFrame(() => {
    $element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  });
}

function getTranslate($element) {
  const values = $element.style.transform
    .replace(/translate3d|\(|\)|%| |px/g, '').split(',')

  return {
    y: parseInt(values[1]),
    x: parseInt(values[0])
  };
}


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
  }

  invert(dimension) {
    this.acceleration[dimension] = this.acceleration[dimension] * (-1);
  }

  checkColision() {
    if ((this.posX <= -600 && this.acceleration.x < 0) || (this.posX >= 600 && this.acceleration.x > 0)) {
      this.invert('x');
    }

    if ((this.posY <= -420 && this.acceleration.y < 0) || (this.posY >= 400 && this.acceleration.y > 0)) {
      this.invert('y');
    }
  }

  update() {
    const nextPosY = this.posY + this.acceleration.y;
    const nextPosX = this.posX + this.acceleration.x;

    this.posY = nextPosY;
    this.posX = nextPosX;

    this.checkColision();

    move(this.$element, nextPosY, nextPosX);
  }
}
