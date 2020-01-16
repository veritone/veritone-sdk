import { barelyBlack, lightBlack, blue1, greenBright, minBlack, fullBlack } from '../../styles/modules/variables';
import { muiText } from '../../styles/modules/muiTypography';

const body1Text = muiText('body1');
const subheadText = muiText('subhead');
export default {
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  prompt: {
    ...body1Text,
    fontFamily: 'monospace',
    wordBreak: 'break-all',
    display: 'inline-flex',
    alignItems: 'center',
    background: barelyBlack,
    minHeight: 35,
    borderRadius: 2,
    padding: '0 15px',
  },
  promptSymbol: {
    ...subheadText,
    color: lightBlack,
    paddingRight: 20,
  },
  button: {
    marginLeft: '10px !important',
  },
  colororange: {
    color: '#ffa726',
  },
  colorblue: {
    color: blue1,
  },
  colorgreen: {
    color: greenBright,
  },
  colorgrey: {
    color: minBlack,
  },
  colorblack: {
    color: fullBlack,
  },
}
