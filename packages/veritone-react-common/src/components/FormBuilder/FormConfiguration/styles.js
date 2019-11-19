import { createStyles, makeStyles } from '@material-ui/core/styles';

export default makeStyles(_ =>
  createStyles({
    configurationItem: {
      'margin-top': '8px !important',
    },
    itemContainer: {
      'display': 'flex',
      'align-items': 'center',
      'margin-top': '8px',
    },
    listItemsContainer: {
      'margin-top': '16px',
    },
    previewIcon: {
      'cursor': 'pointer',
      'opacity': '0.7',
      'margin': '0 8px',
    }
  })
);
