export default {
  folderPaper: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  folderViewContainer: {
    display: 'flex',
    height: '100%',
  },
  folderViewContent: {
    position: 'relative',
    paddingTop: 48,
    width: '100%',
    height: '100%',
    transition: 'width 500ms',
    '&.panelOpen': {
      width: 'calc(100% - 340px)',
    }
  },
  folderNullStateContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexFlow: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    textAlign: 'center',
  }
}
