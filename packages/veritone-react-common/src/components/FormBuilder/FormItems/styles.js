import { createStyles, makeStyles } from '@material-ui/core/styles';

export default makeStyles(_ => createStyles(
  {
    previewContainer: {
      'display': 'flex',
      'align-items': 'center',
    },
    previewContainerSelected: {
      'border': '1px dashed #a5a5a5',
    },
    previewIcon: {
      'margin': '0 0 0 8px',
      'cursor': 'pointer',
    },
    helpIcon: {
      'font-size': '14px',
    },
    itemCheckbox: {
      'display': 'flex',
      'align-items': 'center',
    },
    previewContent: {
      'width': '80% !important',
      'padding-left': '20px',
      'padding-bottom': '20px',
    },
    previewAction: {
      'display': 'flex',
      'margin-left': '20px',
    },
    dialogFooter: {
      'margin': '15px',
    },
    itemPreview: {
      'margin-bottom': '20px',
    },
    titleParagraph: {
      'margin-top': '0',
    },
    box: {
      'border-width': '1px',
      'border-color': 'rgba(0, 0, 0, 0.23)',
      'width': '100%',
      'border-radius': '5px',
    },
    formItem: {
      'margin-top': '20px !important',
    },
    ratingBox: {
      'width': '100%',
      'margin-bottom': '0 !important',
    }
  })
)
