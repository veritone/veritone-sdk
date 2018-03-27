export function msToReadableString(milliseconds) {
  let h, m, s;
  s = Math.floor(milliseconds / 1000);
  m = Math.floor(s / 60);
  s = s % 60;
  h = Math.floor(m / 60);
  m = m % 60;

  h = h < 10 && h > 0 ? '0' + h : h;
  m = m < 10 ? '0' + m : m;
  s = s < 10 ? '0' + s : s;

  return (h > 0 ? h + ':' : '') + m + ':' + s;
}
