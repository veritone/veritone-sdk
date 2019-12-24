export default {
  root: {
    flexGrow: 1,
    position: 'relative',
    zIndex: 9,
    minWidth: 870,
  },
  headerBar: {
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24) !important',
  },
  header: {
    backgroundColor: 'white',
    alignItems: 'stretch !important',
    paddingTop: 12,
    paddingBottom: 12,
    height: 60,
    minHeight: 60,
  },
  button: {
    flexBasis: '108px !important',
  },
  uploadButton: {
    border: '1px solid #2196F3 !important',
    borderRadius: '1px !important',
    color: '#2196F3 !important',
  },
  backButton: {
    color: 'rgba(0, 0, 0, 0.54) !important',
  },
  iconButton: {
    marginRight: 8,
  },
  icon: {
    color: 'rgba(0,0,0,0.26',
  },
  divider: {
    width: 1,
    backgroundColor: 'rgba(0,0,0,0.26)',
    marginTop: 5,
    marginBottom: 5,
    alignSelf: 'stretch',
  },
  buttonGroup: {
    display: 'flex',
    alignItems: 'center',
  },
  sort: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  view: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  spacer: {
    width: '1re',
  },
  disabled: {
    pointerEvents: 'none',
    opacity: 0.5,
  }
}
