// export function getMousePosition(e) {
//   // https://stackoverflow.com/questions/8389156
//   let el = e.target,
//     x = 0,
//     y = 0;
//
//   // fixme -- scroll position seems to not be taken into account
//   while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
//     console.log(el.scrollTop)
//     x += el.offsetLeft - el.scrollLeft;
//     y += el.offsetTop - el.scrollTop;
//     el = el.offsetParent;
//   }
//
//   x = e.clientX - x;
//   y = e.clientY - y;
//
//   return { x: x, y: y };
// }

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

export function hasCommandModifier(e) {
  const platform = navigator.platform;
  const isOSX = platform.includes('Mac');
  return e && isOSX ? !!e.metaKey && !e.altKey : isCtrlKeyCommand(e);
}

export function isCtrlKeyCommand(e) {
  return !!e.ctrlKey && !e.altKey;
}

export function hasShiftKey(e) {
  return e && e.shiftKey;
}

export function hasControlModifier(e) {
  return e && !!e.ctrlKey && !e.altKey;
}

