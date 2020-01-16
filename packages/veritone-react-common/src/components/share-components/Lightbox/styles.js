import { lightBlack, fullBlack, fullWhite } from '../../../styles/modules/variables';

const iconSize = 24;
const buttonSize = 48;
const transitionTime = '0.2s';

export default {
  lightbox: {
    width: '100%',
    height: '100%',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: `opacity ${transitionTime}`,
    '&$open': {
      opacity: 1,
      display: 'flex',
    },
    '&$hidden': {
      display: 'none',
    },
    '&$fullscreen': {
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 1000,
      position: 'absolute',
    },
    '& > $background': {
      width: '100%',
      height: '100%',
      position: 'absolute',
      backgroundColor: lightBlack,
    },
    '& > $content': {
      width: 'fit-content',
      height: 'fit-content',
      position: 'relative',
      boxShadow: '0 11px 15px -7px rgba(0, 0, 0, 0.2), 0 24px 38px 3px rgba(0, 0, 0, 0.14), 0 9px 46px 8px rgba(0, 0, 0, 0.12)',
      '& > $closeButton': {
        top: -buttonSize / 2 + iconSize / 8,
        right: -buttonSize / 2 + iconSize / 8,
        position: 'absolute',
        '& $closeButtonIcon': {
          borderRadius: iconSize / 2,
          color: fullBlack,
          backgroundColor: fullWhite,
          opacity: 0.6,
          transition: `opacity ${transitionTime}`,
        },
        '&:hover $closeButtonIcon': {
          opacity: 1,
        },
      },
    },
  },
  open: {},
  hidden: {},
  fullscreen: {},
  background: {},
  content: {},
  closeButton: {},
  closeButtonIcon: {},
}
