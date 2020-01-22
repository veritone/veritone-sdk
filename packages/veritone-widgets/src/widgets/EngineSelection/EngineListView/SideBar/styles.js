import { grey4, lightBlack, fullBlack, blue1 } from '../../../../styles/modules/variables';
import { muiText } from '../../../../styles/modules/muiTypography';

const dimensions = '24px !important';
const width = 250;
const iconSize = '50px !important';
const body1Text = muiText('body1');

const checkboxCss = {
  height: dimensions,
  width: dimensions,
  marginRight: '8px !important',
};

export default {
  sideBar: {
    minWidth: width,
    maxWidth: width,
    borderRight: `1px solid ${grey4}`,
  },
  isFetching: {
    display: 'flex',
    justifyContent: 'center',
    padding: '40px 0',
  },
  failedToFetchIcon: {
    height: iconSize,
    width: iconSize,
    color: 'rgba(0, 0, 0, 0.26)',
  },
  failedToFetchMessage: {
    fontSize: '18px',
    color: lightBlack,
    fontWeight: '200',
    margin: '15px 0',
  },
  inlineFilter: {
    display: 'inline-flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  filterContainer: {
    ...body1Text,
    padding: '10px 20px',
    color: fullBlack,
  },
  title: {
    fontWeight: 500,
    marginBottom: 10,
  },
  rcSliderHandle: {
    border: `2px solid ${blue1} !important`,
    backgroundColor: `${blue1} !important`,
  },
  rcSliderTrack: {
    backgroundColor: `${blue1} !important`,
  },
  checkbox: {
    ...checkboxCss
  },
  radio: {
    ...checkboxCss
  },
}
