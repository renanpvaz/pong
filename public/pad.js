class Pad {
  constructor($element, upKey = 87, downKey = 83) {
    const { y } = getTranslate($element);
    const intervals = {};
    const keys = {
      [upKey]: {
        press: () => this.move(1)
      },
      [downKey]: {
        press: () => this.move(-1)
      }
    };

    this.$element = $element;
    this.posY = y;

    Object.keys(keys).forEach((code) => {
      const keyCode = parseInt(code);

      window.addEventListener('keydown', (e) => {
        if(!intervals[keyCode] && keyCode === e.which) {
          intervals[keyCode] = setInterval(() => keys[keyCode].press(), 50);
        }
      });

      window.addEventListener('keyup', (e) => {
        if(keyCode === e.which) {
          clearInterval(intervals[keyCode]);
          intervals[keyCode] = null;
        }
      });
    });
  }

  move(acceleration) {
    this.posY += acceleration * 20;

    moveElement(this.$element, this.posY, 0);
  }
}
