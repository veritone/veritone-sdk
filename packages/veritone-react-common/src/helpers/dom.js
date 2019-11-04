export function getMousePosition(e) {
  let el = e.target,
    el_left = 0,
    el_top = 0,
    x,
    y;

  while (el.offsetParent) {
    el_left += el.offsetLeft;
    el_top += el.offsetTop;
    el = el.offsetParent;
  }

  el = e.target;
  while (el.parentNode) {
    el_left -= el.scrollLeft;
    el_top -= el.scrollTop;
    el = el.parentNode;
  }

  x = e.clientX;
  y = e.clientY;

  x -= el_left;
  y -= el_top;

  return { x, y };
}
