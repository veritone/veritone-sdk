import { grey4, grey5 } from '../../../styles/modules/variables';
import { muiText } from '../../../styles/modules/muiTypography';

const previewSize = 40;
const body1Text = muiText('body1');
const filePickerRoundImage = (size, margin = 4) => ({
  width: size,
  height: size,
  margin: margin,
  borderRadius: '50%',
});

export default {
  fileList: {
    flex: '0 0 50%',
    position: 'relative',
    overflowY: 'auto',
    marginLeft: 15,
    height: '100%',
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    height: 50,
    borderBottom: `1px solid ${grey4}`,
  },
  itemPreviewContainer: {
    width: previewSize,
    marginRight: 15,
  },
  itemImage: {
    ...filePickerRoundImage(previewSize),
    backgroundPosition: 'center',
    backgroundSize: `${previewSize}px auto`,
    backgroundRepeat: 'no-repeat',
  },

  itemFolderIcon: {
    ...filePickerRoundImage(previewSize),
    color: 'white',
    backgroundColor: '#b9b9b9',
    textAlign: 'center',
    fontSize: 25,
    paddingTop: 8,
    paddingLeft: 4,
  },
  itemTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    overflow: 'hidden',
    width: '100%',
  },
  itemNameText: {
    ...body1Text,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  itemFileSizeText: {
    ...body1Text,
    color: grey5,
  },
  itemDeleteIcon: {
    width: previewSize,
    height: previewSize,
    padding: 8
  },
  itemActionContainer: {
    display: 'flex'
  }
}
