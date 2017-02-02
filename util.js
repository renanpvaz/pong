function moveElement($element, y, x) {
  window.requestAnimationFrame(() => {
    $element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  });
}

function areElementsOverlaping(a, b) {
    const getPositions = (elem) => {
      const pos = elem.getBoundingClientRect();
      return [[pos.left, pos.right], [pos.top, pos.bottom]];
    };

    const comparePositions = (posA, posB) => {
      let resulA, resultB;

      resulA = posA[0] < posB[0] ? posA : posB;
      resultB = posA[0] < posB[0] ? posB : posA;

      return resulA[1] > resultB[0] || resulA[0] === resultB[0];
    };

    const posA = getPositions(a);
    const posB = getPositions(b);

    return comparePositions(posA[0], posB[0]) && comparePositions(posA[1], posB[1]);
}

function debounce(func, wait, immediate) {
	let timeout;

	return function () {
		const context = this, args = arguments;
		const later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};

		const callNow = immediate && !timeout;

		clearTimeout(timeout);
		timeout = setTimeout(later, wait);

    if (callNow) {
      func.apply(context, args);
    }
	};
}

function getTranslate($element) {
  const values = $element.style.transform
    .replace(/translate3d|\(|\)|%| |px/g, '').split(',')

  return {
    y: parseInt(values[1]),
    x: parseInt(values[0])
  };
}
