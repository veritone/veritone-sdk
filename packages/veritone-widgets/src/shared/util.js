// URI Parser from https://stackoverflow.com/a/39308026
export const ParseURI = url => {
  /* eslint-disable */
  let m = url.match(
      /^(([^:\/?#]+:)?(?:\/\/(([^\/?#:]*)(?::([^\/?#:]*))?)))?([^?#]*)(\?[^#]*)?(#.*)?$/
    ),
    r = {
      hash: m[8] || '', // #asd
      host: m[3] || '', // localhost:257
      hostname: m[4] || '', // localhost
      href: m[0] || '', // http://localhost:257/deploy/?asd=asd#asd
      origin: m[1] || '', // http://localhost:257
      pathname: m[6] || (m[1] ? '/' : ''), // /deploy/
      port: m[5] || '', // 257
      protocol: m[2] || '', // http:
      search: m[7] || '' // ?asd=asd
    };
  if (r.protocol.length === 2) {
    r.protocol = 'file:///' + r.protocol.toUpperCase();
    r.origin = r.protocol + '//' + r.host;
  }
  r.href = r.origin + r.pathname + r.search + r.hash;
  return m && r;
};

// http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
export function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  return `${s4()}-${s4()}-${s4()}`;
}
