export default {
  '@global': {
    '.video-react': {
      '@global': {
        '.video-react-control-bar.mediaPlayerControls': {
          position: 'relative !important',
        },
        '.mediaPlayerControls': {
          fontFamily: 'Roboto, sans-serif',
          outline: 'none !important',
          '& .video-react-control': {
            width: '3em',
          },
          '& .video-react-time-control': {
            paddingLeft: '0.5em',
            paddingRight: '0.5em',
          },
          '& .video-react-control-text, .video-react-mouse-display, .video-react-mouse-display::after, .video-react-play-progress::after': {
            fontFamily: 'Roboto !important',
          },
          '& .video-react-slider:focus': {
            textShadow: 'none',
            boxShadow: 'none',
          }
        }
      }
    }
  },
  externalStyles: {
    top: 'unset !important',
    bottom: 'unset !important',
    position: 'static !important',
  },
}
