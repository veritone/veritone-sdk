export default {
  container: {
    display: 'flex',
  },
  locationalCheckbox: {
    boxSizing: 'border-box',
    height: 202,
    width: 320,
    backgroundColor: '#FFF',
    display: 'inline-block',
    verticalAlign: 'top',
    marginLeft: 10,
  },
  stepItem: {
    textAlign: 'center',
    backgroundColor: '#F5F6F7',
    width: '100%',
    height: '100%',
    padding: '55px 30px 30px',
    border: '1px solid #DADCDF',
    '& $btnActionArea': {
      border: '1px solid #DADCDF',
      borderRadius: 3,
      padding: '7px 25px',
      color: '#1973E8',
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0)',
      },
    },
  },
  ariaItem: {
    display: 'flex',
    justifyContent: 'center',
  },
  introText: {
    marginBottom: 20,
    color: '#5F6369',
    fontFamily: 'Roboto',
    fontSize: 15,
    lineHeight: '20px',
  },
  introTextStep2: {
    marginTop: 50,
    marginRight: 15,
    marginLeft: 15,
    marginBottom: 20,
    color: '#5F6369',
    fontFamily: 'Roboto',
    fontSize: 15,
    lineHeight: '20px',
    textAlign: 'center',
  },
  screenLocation: {
    height: 202,
    width: 340,
    border: '1px solid #DADCDF',
    display: 'inline-block',
    verticalAlign: 'top',
  },
  imageDefault: {
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'contain',
    backgroundImage: 'url(https://s3amazonawscom/staticveritonecom/veritoneUi/nullstatepng)',
    height: 200,
    width: 340,
  },
  btnActionArea: {}
}
