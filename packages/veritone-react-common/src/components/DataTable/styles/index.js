import { lightBlack } from '../../../styles/modules/variables';
import { muiText } from '../../../styles/modules/muiTypography';

const captionText = muiText('caption');
export default {
  tableWrapper: {
    display: 'block',
    overflow: 'auto',
  },
  splitTableWrapper: {
    display: 'block',
    overflow: 'hidden',
  },
  table: {
    tableLayout: 'fixed',
    width: '100%',
  },
  tableCell: {
    whiteSpace: 'normal',
    paddingRight: '24px !important',
  },
  focusTable: {
    transition: 'all 200ms ease',
    transitionProperty: 'max-height, margin-top, margin-bottom',
  },
  leave: {
    '& $focusedRow': {
      maxHeight: 250,
      marginTop: '15px !important',
      marginBottom: '15px !important',
    }
  },
  leaveActive: {
    '& $focusedRow': {
      maxHeight: 48,
      overflow: 'hidden',
      marginTop: '0 !important',
      marginBottom: '0 !important',
    },
  },
  enter: {
    '& $focusedRow': {
      maxHeight: 48,
      overflow: 'hidden',
      marginTop: '0 !important',
      marginBottom: '0 !important',
    },
  },
  enterActive: {
    '& $focusedRow': {
      maxHeight: 250,
      marginTop: '15px !important',
      marginBottom: '15px !important',
    },
  },
  paginatedFooter: {
    color: `${lightBlack} !important`,
    display: 'flex',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexShrink: 0,
    '& $rowsPerPage': {
      ...captionText,
      paddingRight: 28,
    },
    '& $perPage': {
      ...captionText,
      marginRight: 32,
    },
    '& $numItems': {
      paddingRight: 32,
    },
    '& $pageLeft, $pageRight, $refresh': {
      '& button': {
        width: '24px !important',
        height: '24px !important',
      },
      padding: '0 !important',
    },
    '& $pageLeft': {
      marginRight: '24px !important',
    },
    '& $pageRight': {
      marginRight: '0 !important',
    },
  },
  pageLeft: {},
  pageRight: {},
  refresh: {},
  rowsPerPage: {},
  perPage: {},
  numItems: {},
  focusedRow: {},
}
