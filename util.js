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
