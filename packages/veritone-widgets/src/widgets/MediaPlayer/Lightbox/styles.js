import { darkBlack, fullWhite, red500 } from '../../../styles/modules/variables';

export default {
  popupContainer: {
    width: '90vw',
    height: '90vh',
    margin: '0 auto',
    backgroundColor: darkBlack,
    '& > div:first-child': {
      display: 'contents',
      '& > $boundingPolyContent': {
        height: '100%',
        '& > $reactPlayer': {
          height: '100%',
          display: 'contents',
        },
      },
    },
    '& > $liveLabel': {
      top: 20,
      left: 20,
      position: 'absolute',
      borderRadius: '3px',
      padding: '1px 8px',
      fontSize: 12,
      color: fullWhite,
      pointerEvents: 'none',
      backgroundColor: red500,
    },
  },
  boundingPolyContent: {},
  reactPlayer: {},
  liveLabel: {},
}
