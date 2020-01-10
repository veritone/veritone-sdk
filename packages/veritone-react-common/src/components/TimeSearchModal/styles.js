export default {
  timeSearchConfigContent: {
    display: 'flex',
    flexDirection: 'column',
    '& h4, h5': {
      marginTop: 10,
      marginBottom: 10,
    },
  },
  timeSelectSection: {
    display: 'flex',
    flexDirection: 'row',
    flex: '45%',
    '& $timeInputSection': {
      flex: '50%',
      paddingRight: '2em',
    },
  },
  dayOfWeekConfig: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 20,
  },
  dayOfWeekSelection: {
    display: 'flex',
    flexDirection: 'row',
  },
  stationSwitchSection: {
    flex: '55%',
    '& p': {
      marginTop: 0,
    },
  },
  timeInputSection: {},
}
