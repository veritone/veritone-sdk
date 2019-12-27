import { grey3, lightBlue, red500, blue1, grey6, grey2, blue2, fullWhite } from '../../styles/modules/variables';

export default {
  loadingContainer: {
    margin: 'auto',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    position: 'fixed',
    zIndex: 9999,
    minHeight: 80,
  },
  selected: {
    backgroundColor: lightBlue,
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
  },
  rootfolder: {
    '&:hover': {
      backgroundColor: grey3,
      borderTopRightRadius: 50,
      borderBottomRightRadius: 50,
    },
  },
  error: {
    color: red500,
  },
  dialogTitle: {
    padding: '24px 24px 5px !important',
  },
  dialogSubTitle: {
    padding: '0 24px 20px !important',
  },
  dialogContent: {
    border: `2px solid ${grey2}`,
    marginRight: 20,
    marginLeft: 20,
    padding: '0 !important',
  },
  closeIcon: {
    fontSize: '30px !important',
    marginRight: 20,
    marginTop: 20,
    color: grey6,
  },
  workIcon: {
    fontSize: '30px !important',
    margin: 10,
    color: grey6,
  },
  saveText: {
    color: `${blue1} !important`,
    paddingLeft: '30px !important',
    paddingTop: '5px !important',
    paddingBottom: '5px !important',
    textTransform: 'uppercase',
  },
  button: {
    minHeight: '50px !important',
  },
  buttonNewFolder: {
    border: `1px solid ${blue1} !important`,
  },
  buttonSelect: {
    backgroundColor: `${blue1} !important`,
    marginLeft: '5px !important',
    '&:hover': {
      backgroundColor: `${blue2} !important`,
    },
  },
  newFolderButton: {
    color: `${blue1} !important`,
    fontSize: '18px !important',
    fontWeight: 'bold !important',
    textTransform: 'none !important',
  },
  cancelButton: {
    fontSize: '18px !important',
    fontWeight: 'bold !important',
    textTransform: 'none !important',
    color: `${grey6} !important`,
  },
  selectButton: {
    fontSize: '18px !important',
    fontWeight: 'bold !important',
    textTransform: 'none !important',
    color: `${fullWhite} !important`,
  },
  folder: {
    height: 50,
    display: 'flex',
    alignItems: 'center',
    color: grey6,
  },
  collapsibleFolderIcon: {
    fontSize: '30px !important',
    color: grey6,
  },
  folderIcon: {
    fontSize: '30px !important',
    color: `${grey6} !important`,
    marginLeft: 30,
  },
  folderName: {
    fontWeight: 600,
    color: grey6,
    paddingLeft: 10,
  },
  folderNameSelected: {
    color: blue1,
  },
  folderPicker :{
    '& ul': {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      overflow: 'hidden',
    },
    '& li': {
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      '& > div:hover': {
        backgroundColor: grey3,
        borderTopRightRadius: 50,
        borderBottomRightRadius: 50,
      },
      '& div:first-child': {
        paddingLeft: 24,
        overflow: 'hidden',
      },
      '& li': {
        '& div:first-child':{
          paddingLeft: 48,
          overflow: 'hidden',
        },
        '& li': {
          '& div:first-child': {
            paddingLeft: 72,
            overflow: 'hidden',
          },
          '& li': {
            '& div:first-child':{
              paddingLeft: 96,
              overflow: 'hidden',
            },
            '& li': { 
              '& div:first-child':{
                paddingLeft: 120,
                overflow: 'hidden',
              },
              '& li': { 
                '& div:first-child':{
                  paddingLeft: 144,
                }
              }
            }
          }
        }
      }
    }
  }
}
