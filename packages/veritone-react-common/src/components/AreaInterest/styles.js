export default {
  rectangle: {
    display: 'flex',
    border: '1px solid #DADCDF',
    justifyContent: 'space-between',
    borderRadius: 2,
    width: '100%',
    alignItems: 'center',
    height: 38,
    '& button': {
      width: 38,
      height: 38,
    },
  },
  coordinate: {
    color: '#757575',
    fontFamily: 'Roboto',
    fontSize: 14,
    letterSpacing: 0.1,
    marginLeft: 10,
    verticalAlign: 'middle',
  },
  editCoordinate: {
    '& button': {
      width: 38,
      height: 38,
    },
    '& $aoiIconButton': {
      padding: '0 !important',
    },
  },
  flexCenter: {
    paddingLeft: 5,
    display: 'flex',
    alignItems: 'center',
  },
  aoiIconButton: {},
}
