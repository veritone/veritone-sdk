export default {
  wrapper: {
    display: 'flex',
    alignItems: 'flex-start',
    height: '100%',
  },
  colorContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    alignItems: 'flex-start',
  },
  searchBarContainer: {
    padding: '0 8px',
    height: 48,
    display: 'flex',
    alignItems: 'center',
  },
  iconColor: {
    color: '#5f6368',
  },
  input: {
    width: '100%',
    gridColumnStart: 2,
    gridColumnEnd: 8,
    fontSize: '16px !important',
  },
  clearButton: {
    gridColumn: 9,
  },
  loadingIcon: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  focusedColor: {
    backgroundColor: '#fff'
  }
}
