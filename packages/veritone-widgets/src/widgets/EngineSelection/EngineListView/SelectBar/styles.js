import { lightBlack } from '../../../../styles/modules/variables';
import { muiText } from '../../../../styles/modules/muiTypography';

const height = 73;
const iconSize = '22px !important';
const body1Text = muiText('body1');

export default {
  selectBar: {
    ...body1Text,
    display: 'flex',
    alignItems: 'center',
    color: lightBlack,
    padding: '15px 0 10px 5px',
    minHeight: height,
    maxHeight: height,
  },
  selectBarIcons: {
    display: 'inline-flex',
    alignItems: 'center',
    marginLeft: 'auto',
    padding: '0 20px',
  },
  searchBar: {
    width: 285,
  },
  searchBarIcon: {
    height: iconSize,
    width: iconSize,
    verticalAlign: 'bottom',
  },
  searchBarInput: {
    ...body1Text,
  },
  searchBarUnderline: {
    '&:before': {
      height: '1px !important',
    },
  },
  actionMenuDividerContainer: {
    padding: '0 20px',
  },
  actionMenuDivider: {
    borderRight: `1px solid ${lightBlack}`,
    width: 1,
    height: 28,
  },
}
