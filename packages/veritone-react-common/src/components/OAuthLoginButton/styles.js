import { blue1 } from '../../styles/modules/variables';
import { muiText } from '../../styles/modules/muiTypography';

const buttonText = muiText('button');

export default {
  resetButtonStyles: {
    background: 'none',
    border: 0,
    color: 'inherit',
    font: 'inherit',
    lineHeight: 'normal',
    overflow: 'visible',
    padding: 0,
    appearance: 'button',
    userSelect: 'none',
    cursor: 'pointer',
    '&:focus': {
      //outline: 0,
    }
  },
  button: {
    ...buttonText,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'white',
    backgroundColor: blue1,
    borderRadius: 2,
    padding: '8px 20px',
    '& img': {
      height: 20,
    },
    '& $textContainer': {
      paddingLeft: 8,
    }
  },
  textContainer: {},
}
