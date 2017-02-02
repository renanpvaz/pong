class Pad {
  constructor($element, upKey = '87', downKey = '83') {
    const acceleration = 20;
    const { y } = getTranslate($element);

    this.$element = $element;
    this.posY = y;

    const keys = {
      [upKey]: {
        onPress: () => this.move(-acceleration)
      },
      [downKey]: {
        onPress: () => this.move(acceleration)
      },
    };

    window.addEventListener('keydown', (e) => {
      const key = keys[e.keyCode];

      if (key) {
        key.onPress();
      }
    });
  }

  move(acceleration) {
    const nextPosY = this.posY + acceleration;

    this.posY = nextPosY;

    moveElement(this.$element, nextPosY, 0);
  }
}
