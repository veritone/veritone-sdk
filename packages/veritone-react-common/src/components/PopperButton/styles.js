export default {
  container: {
    zIndex: 1000,
  },
  popperCustom: {
    zIndex: 1000,
  },
  newButton: {
    width: '200px !important',
    height: '38px !important',
    padding: '0 !important',
    backgroundColor: '#2196F3 !important',
    color: '#fff !important',
    boxShadow: '0 1px 2px 0 rgba(60,64,67,0.302), 0 1px 3px 1px rgba(60,64,67,0.149) !important',
    '&:hover': {
      backgroundColor: '#1976d2 !important',
      boxShadow: '0 1px 3px 0 rgba(60,64,67,0.302), 0 4px 8px 3px rgba(60,64,67,0.149) !important',
    }
  },
  newText: {
    color: '#FFF',
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: 500,
    lineHeight: '16px',
    marginLeft: 8,
  },
  arrowIcon: {
    position: 'absolute !important',
    right: '8px !important',
  },
  listItemText: {
    padding: '0 !important',
    color: 'rgba(0,0,0,0.87);',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: '1rem',
    lineHeight: '1.5em',
  },
  listItemIcon: {
    fontSize: 20,
    minWidth: 0,
    marginRight: 16
  },
}
