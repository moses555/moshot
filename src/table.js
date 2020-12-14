const elements = Array.from(document.querySelectorAll('.compatability-table td'));

const highlight = event => {
  const element = event.target;
  const x = element.cellIndex;
  const y = element.parentNode.rowIndex;
  if (x === 0 && y === 0) return;

  element.classList.add('highlighted');

  elements.forEach(other => {
    const otherX = other.cellIndex;
    const otherY = other.parentNode.rowIndex;

    if ((x === 0 && y === otherY) || (y === 0 && x === otherX)) {
      other.classList.add('highlighted');
    }
    if (
      x > 0 &&
      y > 0 &&
      ((otherX === x && otherY === 0) || (otherX === 0 && otherY === y))
    ) {
      other.classList.add('highlighted');
    }
  });
};

const unhighlight = () => {
  elements.forEach(element => {
    element.classList.remove('highlighted');
  });
};

elements.forEach(element => {
  element.addEventListener('mouseenter', highlight);
  element.addEventListener('touchstart', highlight);
  element.addEventListener('mouseleave', unhighlight);
  element.addEventListener('touchend', unhighlight);
});
