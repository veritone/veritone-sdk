import { createStyles, makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => createStyles({
  dialog: {
    'max-height': '100%'
  },
  dialogScrollPaper: {
    'justify-content': 'center'
  },
  dialogTitle: {
    'display': 'flex',
    'justify-content': 'space-between',
    'border-bottom': '1px solid #DADCDF',
    'padding': theme.spacing(1, 2),
  },
  dialogContent: {
    'padding': `${theme.spacing(2)}px ${theme.spacing(3)}px 0 ${theme.spacing(3)}px`,
    'height': 'calc(100% - 70px)',
  },
  titleItem: {
    'margin-left': `${theme.spacing(1)}px !important`,
    'cursor': 'pointer',
  },
  previewContainer: {
    'height': '100%'
  },
  previewContent: {
    'height': 'calc(100% - 45px)',
    'overflow': '-moz-scrollbars-none',
    '&:-webkit-scrollbar': { width: '0 !important' }
  },
  formLoading: {
    'align-self': 'center'
  },
  formName: {
    'margin': `${theme.spacing(3)}px !important`,
    'width': '500px !important',
  }
}))
