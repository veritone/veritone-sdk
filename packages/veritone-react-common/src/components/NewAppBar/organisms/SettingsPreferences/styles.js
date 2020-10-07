export default {
  root: {
    overflowX: "hidden",
    overflowY: "auto",
    height: '100%'
  },
  infoBox: {
    borderBottom: "0.5px solid #D5DFE9",
    paddingTop: 20,
    paddingBottom: 20
  },
  avatarGird: {
    display: 'flex',
    alignItems: 'center'
  },
  squareBox: {
    position: 'relative',
    width: '100px',
    height: '100px',
    margin: '0 auto',
  },
  avatar: {
    border: '10px solid #D5DFE9',
    background: '#F2F5F9',
    width: `100% !important`,
    height: `100% !important`,
    padding: 17,
  },
  appInfo: {
    marginBottom: 15
  },
  appName: {
    fontFamily: 'Dosis',
    fontWeight: 500,
    fontSize: 22,
    color: '#335B89',
  },
  version: {
    fontSize: 10,
    color: '#2A323C'
  },
  versionTitle: {
    fontWeight: 500,
    color: '#2A323C'
  },
  appInfoDetail: {
    marginBottom: 15
  },
  speci: {
    fontSize: 12,
    color: '#5C6269'
  },
  speciTitle: {
    fontWeight: 500,
    color: '#2A323C'
  },
  listMenuBox: {
    padding: "0 20px 20px 20px",
  },
  listItemGird: {
    display: 'flex',
    alignItems: 'center'
  },
  listItemBox: {
    textAlign: 'center',
    padding: "25px 15px 0 15px",
    cursor: 'pointer',
    "&:hover $iconImage": {
      backgroundColor: '#F2F5F9'
    },
  },
  listItemTitle: {
    fontSize: 14,
    color: '#2A323C',
  },
  listItemDec: {
    fontSize: 12,
    color: '#5C6269',
  },
  iconImage: {
    padding: 10,
    borderRadius: '4px'
  },
  buttonSU: {
    textTransform: 'initial'
  }
};
