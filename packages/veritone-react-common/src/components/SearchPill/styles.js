import { grey6, minBlack, lightBlack, lightBlue50, grey2, semiBlack, lightRed50, darkWhite } from '../../styles/modules/variables';

export default {
  iconSize: {
    fontSize: '1.5rem !important',
  },
  engineCategoryIcon: {
    color: grey6,
    margin: '0 0.25em !important',
    padding: '0 !important',
    width: 'auto !important',
    height: 'auto !important',
  },
  deleteIcon: {
    color: minBlack,
    margin: 'auto 0.1em auto 0.25em !important',
    fontSize: '1.25em !important',
    '&:hover:not([disabled])': {
      color: lightBlack,
    },
  },
  searchPill: {
    transition: 'background-color 0.1s linear 0.1s',
    borderRadius: '1.25em',
    margin: '0.1em important',
    padding: '0.1em important',
    display: 'inline-flex',
    '&:not([disabled])': {
      cursor: 'pointer',
    },
  },
  searchPillWithoutDelete: {
    paddingRight: '1em',
    '&:disabled': {
      display: 'none',
    },
  },
  searchPillBackgroundColor: {
    backgroundColor: `${lightBlue50} !important`,
    '&:hover:not([disabled])': {
      backgroundColor: `${grey2} !important`,
    },
  },
  searchPillHighlightedBackgroundColor: {
    backgroundColor: `${minBlack} !important`,
    '&:hover:not([disabled])': {
      backgroundColor: semiBlack,
    },
  },
  searchPillExcludeBackgroundColor: {
    backgroundColor: `${lightRed50} !important`,
    '&:hover:not([disabled])': {
      backgroundColor: `${grey2} !important`,
    },
  },
  searchPillSelectedColor: {
    color: `${darkWhite} !important`,
  },
  searchPillSelectedBackgroundColor: {
    backgroundColor: `${minBlack} !important`,
  },
}
