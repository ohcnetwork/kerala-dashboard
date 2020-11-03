export function sumObjectsByKey(...objs) {
  return objs.reduce((a, b) => {
    for (const k in b) {
      // eslint-disable-next-line no-prototype-builtins
      if (b.hasOwnProperty(k)) {
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        a[k] = (a[k] || 0) + b[k];
      }
    }
    return a;
  }, {});
}
