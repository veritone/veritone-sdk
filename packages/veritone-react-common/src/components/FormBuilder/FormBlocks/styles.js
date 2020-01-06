import { createStyles, makeStyles } from '@material-ui/core/styles';

export default makeStyles(_ =>
  createStyles({
    blockContainer: {
      'height': '80px',
      'width': '100px',
      'border': '1px solid #DADCDF',
      'border-radius': '4px',
      'background-color': '#FFF',
      'color': '#5C636B',
      'font-size': '12px',
      'display': 'flex',
      'flex-flow': 'column',
      'justify-items': 'center',
      'text-align': 'center',
      'justify-content': 'center',
      'cursor': 'pointer',
      'margin': '8px',
      'align-items': 'center',

      '& > p': {
        'margin': 0,
      }
    },
    dragPreviewContainer: {
      'padding-left': '16px',
      'height': '60px',
      'width': '200px',
      'border': '1px solid #5C636B',
      'border-radius': '4px',
      'color': '#5C636B',
      'display': 'flex',
      'justify-items': 'center',
      'align-items': 'center',
    },
    blockText: {
      'margin-top': '8px'
    },
    previewText: {
      'margin-left': '8px'
    }
  })
);
