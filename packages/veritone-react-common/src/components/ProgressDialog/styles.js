import { darkBlack } from '../../styles/modules/variables';
import { muiText } from '../../styles/modules/muiTypography';

const display1Text = muiText('display1');
const subheadText = muiText('subhead');

export default {
  container: {
    position: 'relative',
    '& $circularProgressContainer': {
      position: 'absolute',
      height: '100%',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      '& $circularProgress': {
        position: 'relative',
        top: -22,
        //left: '-12,
        //zIndex: '1',
      },
    },
    '& $textContainer': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      '& $percentageContainer': {
        height: 125,
        display: 'flex',
        alignItems: 'center',
        '& $percentage': {
          ...display1Text,
          fontWeight: '200 !important',
        },
      },
      '& $resolutionIconContainer': {
        height: 125,
        '& $resolutionIcon': {
          height: 125,
          width: 125,
        },
      },
      '& $progressMessage': {
        ...subheadText,
        height: 40,
        color: darkBlack,
        textAlign: 'center',
      },
    },
  },
  circularProgress: {},
  textContainer: {},
  percentageContainer: {},
  percentage: {},
  resolutionIconContainer: {},
  resolutionIcon: {},
  progressMessage: {},
  circularProgressContainer: {},
}
