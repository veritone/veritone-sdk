import { lightBlack, blue1 } from '../../../styles/modules/variables';

export const lightBlackColor = lightBlack;

export default {
  breadcrumbContainer: {
    display: 'flex',
    fontSize: '1rem',
    alignItems: 'center',
    borderRadius: 2,
    minWidth: 300,
    flex: 'auto',
    marginLeft: 10
  },
  greyBackround: {
    backgroundColor: '#F5F5F5',
  },
  iconColor: {
    color: lightBlack,
  },
  iconSpacer: {
    marginLeft: 10,
  },
  rootIcon: {
    color: blue1,
    fontSize: '24px !important',
  },
  crumbItem: {
    padding: '0 8px !important',
    minWidth: '0 !important',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    color: lightBlack,
    textOverflow: 'ellipsis',
    overflowX: 'hidden',
    textTransform: 'none !important',
  },
  fontIcon: {
    fontSize: '1.5rem',
    adding: '0 0.5rem',
    color: lightBlack,
  }
}
