import { blue1, minBlack, grey4 } from '../../../styles/modules/variables';

export default {
  mediaPanelContainer: {
    flexBasis: 0,
    transition: 'flex-basis 500ms',
    backgroundColor: '#f4fafe',
    overflow: 'hidden',
    flexShrink: 0,
    zIndex: 1,
    padding: 20,
    borderLeft: `1px solid ${grey4}`,
  },
  mediaInfoContainer: {
    padding: 0,
    display: 'flex',
    flexFlow: 'column',
    maxHeight: '100%',
    alignContent: 'flex-start',
  },
  tableContainer: {
    marginTop: '1rem',
  },
  tableRow: {
    height: '1.5rem !important',
    borderBottom: '0 !important',
  },
  tableCell: {
    fontSize: 14,
    paddingTop: 0,
    paddingBottom: 0,
    borderBottom: '0 !important',
  },
  tableFirstColumn: {
    padding: '0 !important',
    paddingLeft: '0.5rem',
    fontSize: 14,
    color: minBlack,
  },
  tdoName: {
    textAlign: 'center',
    marginTop: '1rem !important',
    fontSize: '18px !important',
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
  },
  iconInfo: {
    fontSize: '200px !important',
    alignSelf: 'center',
    color: blue1,
  },
  imagePreview: {
    maxHeight: 300,
    objectFit: 'contain',
  },
  infoDetails: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  mediaInfoBtnContainer: {
    display: 'flex',
    flexDirection: 'row-reverse',
  },
}
