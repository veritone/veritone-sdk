export default {
  aside: {
    width: 220,
    padding: '10px !important',
    backgroundColor: '#E8EAED',
    display: 'flex',
    flexFlow: 'column',
    position: 'relative',
    zIndex: 10,
    height: '100%',
  },
  navigationItem: {
    padding: '8px 10px !important',
    borderRadius: '0 20px 20px 0 !important',
    '& .icon, svg': {
      color: '#616e7b',
      marginRight: 0,
      fontSize: 20,
    },
    '& span': {
      fontSize: 14,
      color: '#616e7b',
    }
  },
  icon: {
    color: '#616e7b',
    marginRight: 0,
    fontSize: 20,
  },
  spacer: {
    flexGrow: 1,
  },
  divider: {
    marginTop: 16,
    marginBottom: 20,
    marginLeft: 12,
    marginRight: 8,
  },
  selected: {
    background: '#cfdfed !important',
    '& *, span': {
      color: '#1767D2',
    }
  },
  uploadButton: {
    border: '1px solid #2196F3 !important',
    width: 'auto !important',
    alignSelf: 'center',
    padding: '8px !important',
    '& svg': {
      color: '#2196F3 !important',
      margin: '0 !important',
      marginLeft: '8px !important',
    },
    '& div': {
      '& span': {
        color: '#2196F3 !important',
      }
    }
  }
}
