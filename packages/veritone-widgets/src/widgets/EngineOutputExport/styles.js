import { darkWhite, lightBlack, grey1, grey3, grey5, red500 } from '../../styles/modules/variables';
import { muiText } from '../../styles/modules/muiTypography';

const titleText = muiText('title');
const body1Text = muiText('body1');
const captionText = muiText('caption');

export default {
  engineOutputExport: {
    height: '100%',
  },
  engineOutputExportHeader: {
    height: 110,
    backgroundColor: '#1f2532',
    color: darkWhite,
    '& $title': {
      ...titleText,
      padding: '20px 0 0 20px',
    },
    '& $subtitle': {
      ...body1Text,
      padding: '5px 20px 0',
    },
    '& $closeButton': {
      marginTop: 5,
      marginRight: 10,
      float: 'right',
    },
  },
  engineOutputExportContent: {
    padding: '25px 100px',
    overflowY: 'auto',
  },
  engineOutputExportActions: {
    padding: '0 100px',
    '& $actionButton': {
      margin: '20px 0',
    },
  },
  formatSelection: {
    marginBottom: 20,
  },
  exportFormatTitle: {
    ...titleText,
    marginBottom: '15px !important',
  },
  exportFormatSubHeader: {
    ...captionText,
    color: lightBlack,
  },
  expandIcon: {
    marginRight: '10px !important',
  },
  engineListItem: {
    backgroundColor: grey1,
    '& $engineLogo': {
      marginLeft: 30,
      width: 24,
      height: 24,
      backgroundColor: grey3,
      marginTop: 16
    },
    '& $defaultEngineIcon': {
      marginLeft: 30,
    },
    '& $engineNameText': {
      ...body1Text,
      alignItems: 'center',
      marginTop: 16,
      '& $allEnginesText': {
        display: 'flex',
        alignItems: 'center',
        '& $allEnginesInfoIcon': {
          fontSize: '16px !important',
          marginLeft: 5,
          color: grey5,
        },
      },
    },
    '& $customizeOutputBox': {
      ...body1Text,
      width: '100%',
      marginLeft: '30px',
      marginRight: 5,
      display: 'flex',
      alignItems: 'center',
      backgroundColor: 'rgba(33, 150, 243, 0.1)',
      padding: '15px 5px 15px 15px',
      '& $customizeSettingsIcon': {
        color: grey5,
        marginRight: 5,
        flex: 'none',
      },
      '& $customizeSettingsText': {
        flex: 'auto',
      },
      '& $customizeButton': {
        flex: 'none',
      },
    },
  },
  engineConfigInput: {
    width: '65%',
    marginRight: 5,
  },
  formControl: {
    minWidth: '60% !important',
    top: 0,
  },
  selectStyles: {
    width: '100% !important',
  },
  exportFormatSelected: {
    backgroundColor: 'transparent !important',
  },
  subtitleConfigInfo: {
    ...captionText,
  },
  subtitleConfigField: {
    marginTop: 25,
    '& $subtitleFieldLabel': {
      ...captionText,
      color: lightBlack,
    },
    '& $subtitleFieldInput': {
      ...body1Text,
      paddingBottom: 4,
      height: '1.1875em',
    },
    '& $subtitleFieldLabelShrink': {
      transform: 'translate(0, 1.5px)',
      transformOrigin: 'top left',
    },
  },
  errorSnackBar: {
    backgroundColor: `${red500} !important`,
  },
  loadingConfigsContainer: {
    height: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  engineNameListText: {
    marginTop: 20,
    padding: '0 10px'
  },
  title: {},
  subtitle: {},
  closeButton: {},
  actionButton: {},
  engineLogo: {},
  defaultEngineIcon: {},
  engineNameText: {},
  allEnginesText: {},
  allEnginesInfoIcon: {},
  customizeOutputBox: {},
  customizeSettingsIcon: {},
  customizeSettingsText: {},
  customizeButton: {},
  subtitleFieldLabel: {},
  subtitleFieldInput: {},
  subtitleFieldLabelShrink: {}
}

