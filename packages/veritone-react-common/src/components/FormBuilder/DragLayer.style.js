import { createStyles, makeStyles } from '@material-ui/core/styles';

export default makeStyles(_ =>
  createStyles({
    layer: {
      'position': 'fixed',
      'pointer-events': 'none',
      'z-index': '100',
      'left': '0',
      'top': '0',
      'width': '100%',
      'height': '100%',
    }
  })
);
