const handleSize = 6;

export default {
  resizeHandle: {
    backgroundColor: '#4893E2',
    width: `${handleSize} !important`,
    height: `${handleSize} !important`,
  },
  resizeHandleHorizontal: {
    top: `calc(50% - ${handleSize / 2}) !important`,
  },
  resizeHandleVertical: {
    left: `calc(50% - ${handleSize / 2}) !important`,
  },
}
