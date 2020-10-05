export default {
  appBar: {
    top: 0,
    left: 0,
    right: 0,
    display: 'flex',
    position: 'fixed',
    boxShadow: 'none',
    borderBottom: '0.5px solid #D5DFE9',
    '& $logo': {
      cursor: 'pointer',
      '& img': {
        width: '100%',
        height: '100%',
        objectFit: 'scale-down',
        userSelect: 'none',
      },
    },
  },
  humburgerIcon: {
    padding: 7,
    width: 32,
    height: 32
  },
  content: {
    height: '100%',
    flexGrow: '1',
    display: 'flex',
    flexWrap: 'nowrap',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '0 16px',
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
      font: 'Dosis, secondaryLogo, tertiaryLogo, Helvetica, sans-serif',
      fontstyle: 'normal',
      fontweight: '600',
      fontsize: '18px',
      lineheight: '22px',
      letterspacing: '0.225px',
      color: '#465364',
      mixBlendMode: 'normal'
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
