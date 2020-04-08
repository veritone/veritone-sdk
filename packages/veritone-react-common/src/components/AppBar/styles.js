export default {
  appBar: {
    top: 0,
    left: 0,
    right: 0,
    display: 'flex',
    position: 'fixed',
    '& $logo': {
      width: 60,
      height: 60,
      padding: 10,
      cursor: 'pointer',
      '& img': {
        width: '100%',
        height: '100%',
        objectFit: 'scale-down',
        userSelect: 'none',
      },
    },
  },
  content: {
    height: '100%',
    flexGrow: '1',
    display: 'flex',
    flexWrap: 'nowrap',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '0 10px',
    '& > div': {
      display: 'flex',
      flexWrap: 'nowrap',
      flexDirection: 'row',
    },
    '& $left': {
      justifyContent: 'flex-start',
    },
    '& $right': {
      justifyContent: 'flex-end',
    },
    '& $searchBarHolder': {
      flexGrow: '1',
    },
    '& $title': {
      fontSize: 16,
      fontWeight: 400,
      letterSpacing: 0.23,
      font: 'Dosis, secondaryLogo, tertiaryLogo, Helvetica, sans-serif',
    },
    '& $appLogo': {
      userSelect: 'none',
    },
    '& $controllers': {
      display: 'flex',
      alignItems: 'center',
    },
  },
  iconGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconGroupIcon: {
    paddingLeft: 20,
  },
  rightActionLabel: {
    fontWeight: 400,
    fontSize: 14,
    lineHeight: '16px',
    textDecoration: 'none',
    color: 'white',
    cursor: 'pointer'
  },
  noSelect: {
    userSelect: 'none',
  },
  active: {
    opacity: 1
  },
  passive: {
    opacity: 0.8
  },
  logo: {},
  left: {},
  right: {},
  searchBarHolder: {},
  title: {},
  appLogo: {},
  controllers: {},
}
