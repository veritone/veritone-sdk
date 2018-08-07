export function pixelXYWidthHeightToPercentagePoly(
  { x, y, width, height },
  contentWidth,
  contentHeight
) {
  // translate from internal (x, y, width, height) format to veritone's
  // percentage-based vertex format
  return [
    // top-left
    {
      x: x / contentWidth,
      y: y / contentHeight
    },
    // top-right
    {
      x: (x + width) / contentWidth,
      y: y / contentHeight
    },
    // bottom-right
    {
      x: (x + width) / contentWidth,
      y: (y + height) / contentHeight
    },
    // bottom-left
    {
      x: x / contentWidth,
      y: (y + height) / contentHeight
    }
  ];
}

export function percentagePolyToPixelXYWidthHeight(
  poly,
  contentWidth,
  contentHeight
) {
  const pixelBoundingBox = boundingBox(poly).map(({ x, y }) =>
    percentageToPixelCoords({ x, y, contentWidth, contentHeight })
  );

  return pixelBoundingBoxToXYWidthHeight(pixelBoundingBox);
}

function boundingBox(vertices) {
  const xVals = vertices.map(({ x }) => x);
  const yVals = vertices.map(({ y }) => y);

  const minX = Math.min.apply(null, xVals);
  const maxX = Math.max.apply(null, xVals);
  const minY = Math.min.apply(null, yVals);
  const maxY = Math.max.apply(null, yVals);

  return [
    // top-left
    { x: minX, y: minY },
    // top-right
    { x: maxX, y: minY },
    // bottom-right
    { x: maxX, y: maxY },
    // bottom-left
    { x: minX, y: maxY }
  ];
}

function percentageToPixelCoords({ x, y, contentWidth, contentHeight }) {
  return {
    x: x * contentWidth,
    y: y * contentHeight
  };
}

function pixelBoundingBoxToXYWidthHeight([tl, tr, br, bl]) {
  return {
    x: tl.x,
    y: tl.y,
    width: tr.x - tl.x,
    height: bl.y - tl.y
  };
}
