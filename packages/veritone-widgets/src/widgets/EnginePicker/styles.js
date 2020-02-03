export default {
  rowLoader: {
    height: '100% !important',
    width: '100% !important',
    textAlign: 'center',
    display: 'flex !important',
    alignItems: 'center',
    justifyContent: 'center',
  },
  firstLoader: {
    width: '100%',
    textAlign: 'center',
    borderTop: '1px solid #ccc',
    padding: '0.5em',
  },
  infinitePickerContainer: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  errorMessage: {
    display: 'table-row !important',
    textAlign: 'center',
  },
  rowLoaderSpinner: {
    width: '100% !important',
    border: '0 !important',
    textAlign: 'center !important',
  },
  infiniteScrollContainer: {
    flexGrow: '1 !important',
    height: '100%',
    overflow: 'auto',
    display: 'block !important',
  },
  infiniteScrollHeader: {
    width: '100% !important',
    '& tr': {
      display: 'block',
    }
  },
  pickerTitle: {
    display: 'flex',
    padding: '24px 0 12px 24px',
  },
  pickerTitleContainer: {
    width: '50%',
    display: 'flex',
    alignItems: 'center',
  },
  pickerSearchContainer: {
    width: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  tableContainer: {
    width: '100% !important',
    flexGrow: '1 !important',
    height: '100% !important',
  },
  table: {
    width: '100%',
    height: 'calc(100% - 1px)',
  },
  columnRight: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  selected: {
    backgroundColor: 'rgba(33, 150, 243, 0.6)',
  },
  textSpace: {
    marginRight: '0.1em !important',
  },
  textLineHeight: {
    lineHeight: '2.2 !important',
  },
}
