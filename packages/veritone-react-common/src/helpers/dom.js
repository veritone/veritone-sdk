// eslint-disable-next-line import/prefer-default-export
export function getMousePosition(e) {
  let el = e.target;
  let elLeft = 0;
  let elTop = 0;
  let x;
  let y;

  while (el.offsetParent) {
    elLeft += el.offsetLeft;
    elTop += el.offsetTop;
    el = el.offsetParent;
  }

  el = e.target;
  while (el.parentNode) {
    elLeft -= el.scrollLeft;
    elTop -= el.scrollTop;
    el = el.parentNode;
  }

  x = e.clientX;
  y = e.clientY;

  x -= elLeft;
  y -= elTop;

  return { x, y };
}
