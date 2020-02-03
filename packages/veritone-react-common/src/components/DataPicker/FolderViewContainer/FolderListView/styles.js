import { lightBlack, minBlack, darkBlack, faintBlack } from '../../../../styles/modules/variables';

export default {
  tableFirstColumnText: {
    paddingLeft: '12px',
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
  },
  tableFirstColumnFolder: {
    color: darkBlack,
    fontWeight: 500,
  },
  tableRowText: {
    visibility: 'visible',
    position: 'absolute',
    lineHeight: 1.5,
    top: 0,
    padding: '15px 0',
  },
  tableFirstColumn: {
    display: 'flex',
    alignItems: 'center',
  },
  tableIcon: {
    color: lightBlack,
  },
  tableRowHead: {
    height: '0 !important',
    padding: '0 !important',
  },
  tableRowHeadHidden: {
    height: '0 !important',
    lineHeight: '0 !important',
    visibility: 'hidden',
    whiteSpace: 'nowrap',
    padding: '0',
  },
  tableRow: {
    borderBottom: '0 !important',
    color: lightBlack,
    cursor: 'pointer',
    userSelect: 'none',
    paddingRight: '0 !important',
    paddingLeft: '8px !important',
    maxWidth: '0',
    overflowX: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  selected: {
    background: faintBlack,
  },
  unsupported: {
    '&:not($selected)': {
      '& td': {
        color: minBlack,
        '& svg': {
          color: minBlack,
        }
      }
    }
  }
}
