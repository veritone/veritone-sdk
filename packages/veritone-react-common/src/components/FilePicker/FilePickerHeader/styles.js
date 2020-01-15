import { grey1, grey4, semiBlack } from '../../../styles/modules/variables';

export default {
  filePickerHeader: {
    width: '100%',
    minHeight: 93,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: grey1,
    borderBottom: `1px solid ${grey4}`,
  },
  titleIconContainer: {
    display: 'inline-block',
    verticalAlign: 'middle',
    marginRight: 10,
  },
  filePickerTitle: {
    flex: 'auto',
    fontSize: 18,
    paddingLeft: 20,
    paddingTop: 20,
  },
  filePickerMessage: {
    marginLeft: 55,
    paddingBottom: 20,
    fontSize: 14,
  },
  filePickerCloseButton: {
    position: 'absolute !important',
    top: 8,
    right: 5,
  },
  filePickerFlatHeader: {
    padding: 20,
    paddingBottom: '0',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  count: {
    paddingLeft: '0.5em',
    color: semiBlack,
    fontSize: '0.75em',
  },
}
