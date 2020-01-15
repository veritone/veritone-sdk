export default {
  '@keyframes spin': {
    from: {
      transform: 'rotate(0deg)',
    },
    to: {
      transform: 'rotate(360deg)',
    }
  },
  spin: {
    animation: '$spin 750ms linear infinite',
  }
}
