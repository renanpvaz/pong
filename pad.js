class Pad {
  constructor($element, upKey = '87', downKey = '83') {
    const { y } = getTranslate($element);
    let interval;

    this.$element = $element;
    this.posY = y;

    const keys = {
      [upKey]: {
        onPress: () => this.move(-1)
      },
      [downKey]: {
        onPress: () => this.move(1)
      },
    };

    window.addEventListener('keydown', (e) => {
      const key = keys[e.keyCode];

      if(!interval && key){
        interval = setInterval(key.onPress, 50);
      }
    });

    window.addEventListener('keyup', (e) => {
      clearInterval(interval);
      interval = null;
    });
  }

  move(acceleration) {
    this.posY += acceleration * 20;

    moveElement(this.$element, this.posY, 0);
  }
}
