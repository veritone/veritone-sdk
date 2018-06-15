export function getMousePosition(e) {
  // https://stackoverflow.com/questions/8389156
  let el = e.target,
    x = 0,
    y = 0;

  while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
    x += el.offsetLeft - el.scrollLeft;
    y += el.offsetTop - el.scrollTop;
    el = el.offsetParent;
  }

  x = e.clientX - x;
  y = e.clientY - y;

  return { x: x, y: y };
}
