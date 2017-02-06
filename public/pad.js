class Pad {
  constructor($element, { up = 87, down = 83}, controllable) {
    const intervals = {};

    this.yBounds = (document.querySelector('.container').clientHeight / 2) - (PAD_SIZE / 2);
    this.$element = $element;
    this.posY = 0;

    if (controllable) {
      const keys = {
        [up]: {
          press: () => this.move(1)
        },
        [down]: {
          press: () => this.move(-1)
        }
      };

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
    } else {
      window.addEventListener('update', this.update.bind(this));
    }
  }

  update() {
    moveElement(this.$element, this.posY, 0);
  }

  move(acceleration) {
    this.posY += acceleration * 20;

    if (this.posY >= this.yBounds) {
      this.posY = this.yBounds;
    } else if (this.posY <= -(this.yBounds)) {
      this.posY = -(this.yBounds);
    }

    moveElement(this.$element, this.posY, 0);
  }
}
