export default {
  // list engine 
  listEngineCategories: {
    height: 250
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 8
  },
  root: {
    margin: 0,
    height: 250
  },
  icon: {
    fontSize: 50,
    color: '#3e89ca'
  },
  cardContent: {
    textAlign: "center"
  },
  cardTitle: {
    textTransform: "uppercase",
    fontSize: 16,
    fontWeight: 500,
    color: "#666666",
    whiteSpace: "nowrap",
    paddingBottom: 10
  },
  cardDes: {
    fontSize: 14
  },
  selectLibraries: {
    minWidth: 120
  },
  labelInput: {
    fontSize: 12
  },

  // index 
  title: {
    fontWeight: '400 !important',
    color: '#fff'
  },

  mainUpload: {
    minWidth: '550px',
    border: '1px solid #cccccc',
    borderRadius: '3px',
  },
  mainUploadHeader: {
    height: '64px',
    borderBottom: '1px solid #cccccc',
  },
  iconUploadHeader: {

    'div:nth-child(1)': {
      minWidth: '38px !important',
    }
  },
  iconClose: {
    position: 'absolute !important',
    right: '10px',
    top: '8px',
    color: '#fff !important'
  },

  mainUploadBody: {
    minHeight: '375px'
  },
  titleProcessing: {
    fontSize: '18px !important',
    paddingBottom: '10px',
    color: '#666',
  },
  showAdvanced: {
    color: '#3e89ca',
    cursor: 'pointer',
    fontSize: '14px',
    float: 'right',
  },
  availableEngines: {
    maxWidth: '45% !important',
    flexBasis: '45% !important',
  },
  formEngines: {
    width: '100%'
  },
  listEngines: {
    borderRadius: '2px',
    padding: '15px 15px 0 15px',
    overflowY: 'auto',
    marginTop: '10px',
    height: 'calc(100vh - 438px)'
  },
  ss: {
    marginBottom: '15px'
  },
  ss: {
    fontWeight: 'bold',
    fontSize: '14px',
  },
  $: {
    textAalign: 'center',
    fontSize: '20px !important'
  },
  desContentEngines: {
    textAlign: 'center',
    fontSize: '16px !important',
    display: 'none',
  },
  iconSelectedEngines: {
    maxWidth: '10% !important',
    flexBasis: '10% !important',
    justifyContent: 'center',
    display: 'flex',

    '& svg': {
      fontSize: '72px',
      color: '#ccc',
      height: '100%',
    }
  },
  selectedEngines: {
    maxWidth: '45% !important',
    flexBasis: '45% !important',
  },
  uploadHeader: {
    overflow: 'inherit !important',
    width: 'calc(100% / 4) !important',
    margin: '0 auto',
    marginTop: '120px',
    border: '1px dashed #cccccc',
    padding: '100px 20px 70px 20px',
    minWidth: '465px',
    minHeight: '268px',
  },

  iconUploadBody: {
    width: '110px',
    height: '110px',
    margin: '0px auto',
    marginTop: '-160px',
    borderRadius: '100%',
    border: '1px dashed #cccccc',
    backgroundColor: 'white',
    textAlign: 'center',

    '& svg': {
      fontSize: '40px',
      marginTop: '35px',
      color: '#cccccc',
    }
  },

  titleUpload: {
    textAlign: 'center',
    marginTop: '30px',
    fontSize: '22px',
    fontWeight: 500,
    color: '#3e8acc',
    cursor: 'pointer',
  },

  titleSelect: {
    marginTop: '50px',
    textAlign: 'center',
    fontSize: '14px',
    padding: '0 10px',
    color: '#86939e'
  },

  uploadFoolter: {
    paddingTop: '5px',
    minWidth: '465px',
    width: 'calc(100% / 4) !important',
    margin: '0 auto',
    fontSize: '12px',
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.67)',

    '& span:nth-child(1)': {
      fontWeight: 'bold',
    },

    '& span:nth-child(2)': {
      marginLeft: '5px'
    }
  },

  titleHeaderengines: {
    display: 'none'
  },

  iconHeaderEngines: {
    display: 'none',

    '& svg': {
      color: '#2196f3',
      fontSize: '26px',
      marginBottom: '8px'
    },

    '& img': {
      maxHeight: '38px',
      maxWidth: '150px',
    }
  },

  iconContentEngines: {
    display: 'flex',
    justifyContent: 'center',

    '& svg': {
      color: '#2196f3',
      fontSize: '26px',
      marginTop: '14px'
    },

    '& img': {
      maxHeight: '80px',
      maxWidth: '100%',
    }
  },

  iconHeaderSelectedEngines: {
    '& svg': {
      color: '#2196f3',
      fontSize: '26px',
      marginBottom: '8px'
    },

    '& img': {
      maxHeight: '38px',
      maxWidth: '150px',
    }
  },

  titleContentEngines: {
    fontSize: '24px',
    textAlign: 'center'
  },

  cardHeaderEngines: {
    padding: '16px 16px 0 16px'
  },
  iconAddEngines: {
    color: '#00b16a',
    fontSize: '30px'
  },

  ratingEngines: {
    fontSize: '14px',
    marginTop: '20px'
  },
  priceEngines: {
    fontSize: '14px',
    display: 'none',
    marginTop: '20px'
  },

  cardContentEngines: {
    padding: '16px'
  },

  cardEngines: {

    marginBottom: '15px',

    '&:hover': {

      '& $desContentEngines': {
        display: 'block'
      },

      '& $iconHeaderEngines': {
        display: 'block',
      },

      '& $titleContentEngines': {
        display: 'none',
      },

      '& $iconContentEngines': {
        display: 'none',
      },

      '& $priceEngines': {
        display: 'block',
      },

      '& $ratingEngines': {
        display: 'none',
      }
    }
  },

  titleCategorySelected: {
    height: '30px',
    borderRadius: '3px',
    backgroundColor: '#ececec',
    lineHeight: '30px',
    marginBottom: '15px',
    textAlign: 'center',
  },

  dialogContent: {
    padding: '8px 24px'
  },

  listSelectedEngines: {
    borderRadius: '2px',
    padding: '15px 15px 0 15px',
    overflowY: 'auto',
    marginTop: '10px',
    height: 'calc(100vh - 400px)'
  },

  titleFormSelectEngine: {
    fontWeight: 500,
    color: '#333333',
    fontSize: '18px'
  },

  contentSelectedEngine: {
    display: 'flex',
    flexDirection: 'row'
  },

  iconSaveTemplate: {
    marginTop: '10px',
    marginLeft: '20px'
  },

  cardEngineSelected: {
    border: '1px solid #3E89CA',
    backgroundColor: 'rgba(225, 241, 255, 0.52)',
    height: 250
  },

  //edit file
  dialogEditFileContent: {
    padding: '0px !important',
    minWidth: '700px',
    maxWidth: '700px !important',
  },

  tabsContent: {
    padding: '0 16px',
    backgroundColor: '#f4f4f4',
    borderRadius: '0 !important',
  },

  tabs: {
    minHeight: '38px !important',
    maxWidth: '300px',
  },

  tab: {
      fontSize: '12px !important',
      minHeight: '38px !important',
  },

  generalContent: {
      padding: '0 16px'
  },

  generalInfo: {
    fontSize: '18px',
    color: '#808080'
  },

  generalText: {
      color: '#808080',
  },

  uploadImage: {
      height: '200px',
      border: '1px dashed #808080',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      textAlign: 'center',
  },

  uploadImageContent: {
      height: '100%',
      padding: '55px 0px',
      cursor: 'pointer',
      backgroundColor: 'white',
      opacity: '.8',
      transition: 'all 0.5s',
  },

  iconUpload: {
      fontSize: '60px !important',
  },

  fileName: {
      marginTop: '20px'
  },
   
  loadingUpload: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'calc(100% - 74px)'
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  formfieldsEngine: {
    "& > *": {
      margin: '8px',
      minWidth: '120px'
    }
  },
  //content templates
  cardContentTemplate: {
    marginTop: '10px'
  },
  formContentTemplate: {
    width: '100%',
    marginBottom: '10px'
  },
  cardHeaderContentTemplate: {
    padding: '10px 16px 0px 16px',

    '& span': {
      fontSize: '18px'
    }
  },
  cardMainContentTemplate: {
    padding: '0 16px 0px 16px',
  },

  listContentTemplateLeft: {
    height: 'calc(100vh - 198px)',
    overflow: 'auto'
  },

  listContentTemplateRight: {
    height: 'calc(100vh - 198px)',
    overflow: 'auto'
  },

  titleSelectContentTemplate: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  // customize
  titleCustomize: {
    fontSize: '20px',
    lineHeight: '24px',
    display: 'block',
    paddingBottom: '5px',
    fontWeight: '400',
  },

  contentCustomize: {
    marginBottom: '45px'
  },
  listTagsCustomize: {
    marginTop: '20px',
    flexWrap: 'wrap',
    '& > *': {
      margin: '5px'
    }
  }

}
