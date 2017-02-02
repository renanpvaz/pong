
window.addEventListener('load', () => {
  new Pong();

  //
  //
  //
  // const PAD_ACCELERATION = 20;
  //
  // const $left = document.querySelector('.pad.left');
  // const $right = document.querySelector('.pad.right');
  //
  // function move($element, y, x) {
  //   window.requestAnimationFrame(() => {
  //     $element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  //   });
  // }
  //
  // function getTranslate($element) {
  //   const values = $element.style.transform
  //     .replace(/translate3d|\(|\)|%| |px/g, '').split(',')
  //
  //   return {
  //     y: parseInt(values[1]),
  //     x: parseInt(values[0])
  //   };
  // }
  //
  // const keys = {
  //   '87': {
  //     name: 'W',
  //     onPress: () => move($left, -PAD_ACCELERATION)
  //   },
  //   '83': {
  //     name: 'S',
  //     onPress: () => move($left, PAD_ACCELERATION)
  //   },
  //   '38': {
  //     name: 'UP',
  //     onPress: () => move($right, -PAD_ACCELERATION)
  //   },
  //   '40': {
  //     name: 'DOWN',
  //     onPress: () => move($right, PAD_ACCELERATION)
  //   },
  // };
  //
  // window.addEventListener('keydown', function (e) {
  //   const key = keys[e.keyCode];
  //
  //   if (key) {
  //     key.onPress();
  //   }
  // });
});
