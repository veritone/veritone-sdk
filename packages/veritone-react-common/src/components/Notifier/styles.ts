const spinnerWidth = 24;
const spinnerColor = '#2196F3';
const spinnerBackground = '#CCEBFF';

const outroTransition = () => ({
  transition: 'opacity 0.6s, margin-left 0.6s,height 0.4s 0.6s, padding 0.4s 0.6s, margin-top 0.4s 0.6s, margin-bottom 0.4s 0.6s',
});

export default {
  '@keyframes fadeInAnimation': {
    '0%': {
      opacity: 0,
    },
    '100%': {
      opacity: 1,
    }
  },
  '@keyframes spin': {
    to: {
      transform: 'rotate(360deg)',
    }
  },
  notification: {
    display: 'flex',
    alignItems: 'center',
    '& $toolTipWrapper': {
      display: 'inline-block',
    },
    '& $badge': {
      top: -6,
      right: -6,
      width: 16,
      height: 16,
      fontSize: 10,
      backgroundColor: '#00BCD4',
    }
  },
  popover: {
    marginTop: 18,
  },
  notificationWindow: {
    width: 566,
    height: '100%',
    color: 'white',
    backgroundColor: '#323232',
    '& $header': {
      fontSize: 14,
      fontWeight: 500,
      lineHeight: '48px',
      padding: '0 16px',
      backgroundColor: '#454545',
      display: 'flex',
      flexDirection: 'row',

      '& $label': {
        minWidth: 0,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
      '& $chip': {
        height: 16,
        fontSize: 10,
        lineHeight: '15px',
        padding: '1px 10px 0',
        borderRadius: 8,
        marginTop: 16,
        marginLeft: 20,
        backgroundColor: '#00BCD4',
      },
      '& $controls': {
        marginLeft: 'auto',
      }
    },
    '& $body': {
      height: 'auto',
      maxHeight: 352,
    }
  },
  notificationList: {
    overflow: 'auto',
    maxHeight: 'inherit',
    '& $entry': {
      width: '100%',
      height: 64,
      padding: 16,
      display: 'flex',
      flexDirection: 'row',
      justifyItems: 'center',
      '&$fadeIn': {
        animation: '$fadeInAnimation 0.5s',
      },
      '&$slideOut': {
        opacity: 0,
        height: 0,
        padding: 0,
        marginTop: 0,
        marginBottom: 0,
        marginLeft: -600,
        ...outroTransition,
      },
      '&$fadeOut': {
        opacity: 0,
        height: 0,
        padding: 0,
        marginTop: 0,
        marginBottom: 0,
        ...outroTransition,
      },
      '&$noOutro': {
        display: 'none',
      },
      '& > div:not(:last-child)': {
        marginRight: 16,
      },
      '& $visualStatus': {
        width: 30,
        display: 'flex',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
      },
      '& $description': {
        flex: 1,
        minWidth: 0,
        '& div': {
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        '& $title': {
          fontSize: 14,
          lineHeight: '20px',
        },
        '& $subtitle': {
          fontSize: 12,
          color: 'rgba(255,255,255,0.54)',
        },
      },
      '& $extra': {
        width: 130,
        fontSize: 12,
        lineHeight: '32px',
        color: 'rgba(255,255,255,0.54)',
        display: 'flex',
        flexDirection: 'row',
        justifyItems: 'center',
        '& $description': {
          flex: 1,
          minWidth: 0,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        '& $actions': {
          '& $iconButton': {
            width: 32,
            height: 32,
            '& $icon': {
              color: 'rgba(255,255,255,0.54)',
            },
          }
        }
      }
    },
    '& $spinner:before': {
      content: '""',
      boxSizing: 'border-box',
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: spinnerWidth,
      height: spinnerWidth,
      marginTop: -spinnerWidth / 2,
      marginLeft: -spinnerWidth / 2,
      borderRadius: '50%',
      border: `2px solid ${spinnerColor}`,
      borderTopColor: spinnerBackground,
      animation: '$spin .6s linear infinite',
    }
  },
  toolTipWrapper: {},
  badge: {},
  header: {},
  label:{},
  chip: {},
  controls: {},
  body: {},
  entry: {},
  fadeIn: {},
  slideOut: {},
  fadeOut: {},
  noOutro: {},
  visualStatus: {},
  description: {},
  title: {},
  subtitle: {},
  extra: {},
  actions: {},
  iconButton: {},
  icon: {},
  spinner: {},
}