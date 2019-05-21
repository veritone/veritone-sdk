export function getPolysForTime(series, timeMs) {
  return series
    .filter(
      ({ startTimeMs, stopTimeMs }) =>
        startTimeMs <= timeMs && timeMs <= stopTimeMs
    )
    .map(({ object }) => object);
}
