import { lightBlack, darkBlack, blue1, grey4 } from '../../../../styles/modules/variables';
import { muiText } from '../../../../styles/modules/muiTypography';

const body1Text = muiText('body1');
const body2Text = muiText('body2');

export default {
  addRemoveSelectedBar: {
    ...body1Text,
    display: 'inline-flex',
    width: '100%',
    height: 49,
    padding: '0 30px',
    color: lightBlack,
    borderBottom: `1px solid ${grey4}`,
    backgroundColor: '#f6fbff',
    alignItems: 'center',
  },
  back: {
    display: 'inline-flex',
    alignItems: 'center',
  },
  selectedCountText: {
    ...body1Text,
    color: darkBlack,
    marginLeft: 10,
  },
  selectMessage: {
    color: blue1,
    ...body2Text,
  },
  selectedCount: {
    fontWeight: '500 !important',
  },
  bulkActions: {
    display: 'inline-flex',
    marginLeft: 'auto',
  },
}
