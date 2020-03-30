export default {
  '@global': {
    '.video-react': {
      '@global': {
        '.video-react-big-play-button.video-react-big-play-button-center': {
          top: '50%',
          left: '50%',
          marginLeft: '-0.75em !important',
          marginTop: '-0.75em !important',
          height: '1.5em',
          width: '1.5em',
          borderRadius: '1em',
          border: 'none',
        },
        '.video-react-poster': {
          backgroundSize: 'cover !important',
        },
      },
      '& .video-react-control-bar': {
        backgroundColor: 'black',
        fontFamily: 'Roboto, sans-serif',
        outline: 'none !important',
      },
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
  },
}