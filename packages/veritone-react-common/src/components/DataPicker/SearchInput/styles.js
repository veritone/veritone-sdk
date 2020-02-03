export default {
  clearIcon: {
    display: 'none',
    color: 'rgba(0, 0, 0, 0.26)',
    cursor: 'pointer',
  },
  searchInput: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 24,
    paddingRight: 0,
    width: 0,
    transition: 'width 500ms cubic-bezier(0.075, 0.82, 0.165, 1)',
    border: 'none',
    outline: 'none',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    cursor: 'pointer',
    '&:focus': {
      width: 240,
    },
    '&:focus + $clearIcon': {
      display: 'flex',
      justifyItems: 'center',
    }
  },
  search: {
    position: 'relative',
    borderRadius: 2,
    marginLeft: 0,
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(0, 0, 0, 0.26)',
  },
}
