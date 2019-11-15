import { createStyles, makeStyles } from '@material-ui/core/styles';

export default makeStyles(_ =>
  createStyles({
    formBuilder: {
      'display': 'flex',
      'max-width': '1200px',
      'margin': 'auto',
      'height': '100%',
    },
    formBlocks: {
      'max-width': '350px',
      'flex-basis': '50%',
    },
    formBlocksTitle: {
      'margin-left': '8px !important',
      'margin-bottom': '12px !important',
    },
    blocksWrapper: {
      'display': 'flex',
      'flex-flow': 'row',
      'flex-wrap': 'wrap',
    },
    blocksPreview: {
      'flex-basis': '70%',
      'max-height': '100%',
      'overflow-y': 'auto',
      'overflow': '-moz-scrollbars-none',

      '&::-webkit-scrollbar': {
        'width': '0 !important'
      }
    },
    configurationContainer: {
      'padding-left': '10px',
      'width': '400px',
    },
    formConfigurationTitle: {
      'margin-bottom': '12px !important',
    }
  }
))
