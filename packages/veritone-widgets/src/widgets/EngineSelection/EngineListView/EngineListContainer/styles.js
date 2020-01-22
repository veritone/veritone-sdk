import { fullWhite, minBlack, lightBlack, faintBlack } from '../../../../styles/modules/variables';
import { muiText } from '../../../../styles/modules/muiTypography';

const dimensions = 110;
const display2Text = muiText('display2');
const subheadText = muiText('subhead');

export default {
  noEnabledEngines: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '130px 0',
  },
  noEnabledEnginesContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    height: 228,
    width: 715,
    border: `2px dashed ${faintBlack}`,
  },
  noEnabledEnginesIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: dimensions,
    width: dimensions,
    borderRadius: '50%',
    border: `2px dashed ${faintBlack}`,
    marginTop: -(dimensions / 2),
    marginBottom: 34,
    background: fullWhite,
    '& > i': {
      fontSize: 42,
      color: minBlack,
    },
  },
  noEnabledEnginesText: {
    fontSize: 28,
    fontWeight: 300,
    color: lightBlack,
    marginBottom: 20,
  },
  isFetching: {
    display: 'flex',
    justifyContent: 'center',
    padding: '40px 0',
  },
  noResults: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    '& > i': {
      ...display2Text,
      color: minBlack,
    },
  },
  noResultsMessage: {
    ...subheadText,
    fontWeight: '500 !important',
    color: minBlack,
  },
}
