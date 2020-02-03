export default {
  uploaderContainer: {
    display: 'flex',
    flexFlow: 'column',
    height: 'calc(100% - 64px)',
  },
  uploaderContent: {
    flexGrow: 1,
    display: 'flex',
    flexFlow: 'column',
    padding: 16,
  },
  uploaderUploadArea: {
    flexGrow: 1,
    display: 'flex',
    height: '100%',
  },
  uploaderFileList: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'space-between',
  },
  uploadProgressContainer: {
    overflowY: 'auto',
    maxHeight: 240,
  },
  uploaderRetryButtonContainer: {
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
}
