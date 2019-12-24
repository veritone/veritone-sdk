const handleSize = 6;

export default {
  resizeHandle: {
    backgroundColor: 'white',
    width: `${handleSize}px !important`,
    height: `${handleSize}px !important`,
  },
  resizeHandleHorizontal: {
    top: `calc(50% - ${handleSize / 2}) !important`,
  },
  resizeHandleVertical: {
    left: `calc(50% - ${handleSize / 2}) !important`,
  },
  clearfix: {
    '&::after': {
      content: '',
      clear: 'both',
      display: 'table',
    }
  }
}
