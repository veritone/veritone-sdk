export default {
  folderTreeContainer: {
    height: '100%',
    backgroundColor: '#FFF',
    overflow: 'auto',
  },
  folderItemContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  folderItem: {
    marginRight: '10px',
    fontSize: '25px',
    lineHeight: 'inherit',
    color: '#555',
  },
  selected: {
    color: '#2196f3',
  },
  folderIcon: {
    color: '#f0c56a',
    fontSize: '25px',
    lineHeight: 'inherit',
  },
  contentIcon: {
    color: '#555',
    marginRight: '10px',
    fontSize: '25px',
    lineHeight: 'inherit',
  },
  expandIcon: {
    minWidth: '20px',
    width: '20px',
    height: '20px',
    color: 'rgb(85, 85, 85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loading: {
    textAlign: 'center',
    padding: '10px',
  },
  iconMenu: {
    display: 'none',
  },
  listItem: {
    padding: '5px 0 !important',
    minHeight: '42px',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.08)',
      '& $iconMenu': {
        display: 'block',
      }
    }
  },
  iconProgress: {
    display: 'block',
    padding: '0 5px',
  },
  folder: {
    padding: '0 !important',
    cursor: 'pointer',
  },
  subFolder: {
    display: 'block !important',
    padding: '0 !important',
    marginLeft: '20px !important',
  },
  highlighted: {
    backgroundColor: 'rgba(0, 0, 0, 0.07) !important',
  },
  listItemText: {
    width: '100%',
    lineHeight: '15px',
    verticalAlign: 'middle',
    whiteSpace: 'nowrap !important',
    overflow: 'hidden !important',
    textOverflow: 'ellipsis !important',
    textTransform: 'none',
    fontSize: '13px !important',
    fontFamily: 'Roboto',
    paddingLeft: '5px',
    userSelect: 'none'
  }
}
