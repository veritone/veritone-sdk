import { createStyles, makeStyles } from '@material-ui/core/styles';

export default makeStyles(_ => createStyles({
  dialogContent: {
    'padding-bottom': '20px !important',
    'display': 'flex',
    'flex-flow': 'column',
  },
  dialogTitle: {
    padding: '8px 24px !important'
  },
  dialogLoading: {
    'align-self': 'center'
  }
}));
