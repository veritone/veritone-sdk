export default {
  searchBoxRoot: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    borderBottom: '1px solid #e3e3e3',
    '& $input': {
      marginLeft: '8px',
      flex: '1'
    },
    '& $iconButton': {
      padding: '10px'
    }
  },
  input: {},
  iconButton: {},
  closeIcon: {
    color: '#7e7e7e'
  }
};
