import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get, isArray } from 'lodash';
import { bool, func, string, arrayOf, shape, number, any } from 'prop-types';

import Dialog from '@material-ui/core/Dialog';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/styles';

import styles from './styles';

import * as engineOutputExportModule from '../../redux/modules/engineOutputExport';
import widget from '../../shared/widget';
import EngineCategoryConfigList from './EngineCategoryConfigList';

@withStyles(styles)
@connect(
  state => ({
    includeMedia: engineOutputExportModule.getIncludeMedia(state),
    outputConfigsByCategoryId: engineOutputExportModule.outputConfigsByCategoryId(
      state
    ),
    expandedCategories: engineOutputExportModule.expandedCategories(state),
    fetchingEngineRuns: engineOutputExportModule.fetchingEngineRuns(state),
    fetchingCategoryExportFormats: engineOutputExportModule.fetchingCategoryExportFormats(
      state
    ),
    errorSnackBars: engineOutputExportModule.errorSnackBars(state),
    fetchEngineRunsFailed: engineOutputExportModule.fetchEngineRunsFailed(state)
  }),
  {
    setIncludeMedia: engineOutputExportModule.setIncludeMedia,
    exportAndDownload: engineOutputExportModule.exportAndDownload,
    closeSnackBar: engineOutputExportModule.closeSnackBar
  },
  null,
  { forwardRef: true }
)
class EngineOutputExport extends Component {
  static propTypes = {
    tdos: arrayOf(
      shape({
        tdoId: string.isRequired,
        mentionId: string,
        startOffsetMs: number,
        stopOffsetMs: number
      })
    ).isRequired,
    open: bool,
    onCancel: func,
    onExport: func,
    includeMedia: bool,
    setIncludeMedia: func,
    fetchingEngineRuns: bool,
    fetchingCategoryExportFormats: bool,
    exportAndDownload: func.isRequired,
    errorSnackBars: arrayOf(shape({})),
    closeSnackBar: func,
    fetchEngineRunsFailed: bool,
    classes: shape({ any }),
  };

  handleIncludeMediaChange = event => {
    this.props.setIncludeMedia(event.target.checked);
  };

  handleExportAndDownload = () => {
    this.props.exportAndDownload(this.props.tdos).then(response => {
      const createExportRequest = get(response, 'createExportRequest');
      this.props.onExport(createExportRequest);
      return createExportRequest;
    });
  };

  render() {
    const {
      tdos,
      includeMedia,
      fetchingEngineRuns,
      fetchingCategoryExportFormats,
      open,
      onCancel,
      errorSnackBars,
      closeSnackBar,
      fetchEngineRunsFailed,
      classes
    } = this.props;

    const disableExportButton =
      fetchingEngineRuns ||
      fetchingCategoryExportFormats ||
      fetchEngineRunsFailed;

    const snackBarClasses = {
      error: classes.errorSnackBar
    };

    return (
      <Dialog
        fullScreen
        open={open}
        data-veritone-component="export-and-download-dialog"
      >
        <Grid
          container
          direction="column"
          justify="flex-start"
          className={classes.engineOutputExport}
        >
          <Grid item className={classes.engineOutputExportHeader} container>
            <Grid item xs={11}>
              <div className={classes.title}>{`${
                tdos.length > 1 ? 'Bulk ' : ''
                }Export and Download`}</div>
              <div className={classes.subtitle}>
                Select the category, engine, and format type you would like to
                export with the option to download the corresponding file.
              </div>
            </Grid>
            <Grid item xs={1}>
              <IconButton
                className={classes.closeButton}
                color="inherit"
                onClick={onCancel}
                aria-label="Close"
                data-veritone-element="export-and-download-close-button"
              >
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
          <Grid
            item
            xs
            className={classes.engineOutputExportContent}
            container
            direction="column"
            alignItems="center"
          >
            <Grid item xs={12}>
              <Card className={classes.formatSelection}>
                <CardHeader
                  title="Export Format Selection"
                  subheader="Select the preferred engine categories and engines that have processed the file(s). Then choose the applicable format(s) to include in your export."
                  classes={{
                    title: classes.exportFormatTitle,
                    subheader: classes.exportFormatSubHeader
                  }}
                />
                <EngineCategoryConfigList tdos={tdos} />
              </Card>
              <Card>
                <CardHeader
                  title="Enable File Download"
                  action={
                    <Switch
                      checked={includeMedia}
                      onChange={this.handleIncludeMediaChange}
                      color="primary"
                      data-veritone-element="export-and-download-include-media-switch"
                    />
                  }
                  subheader="Include the media file with your format export. Downloading the file may increase the wait time."
                  classes={{
                    title: classes.exportFormatTitle,
                    subheader: classes.exportFormatSubHeader
                  }}
                />
              </Card>
            </Grid>
          </Grid>
          <Grid
            item
            container
            justify="flex-end"
            alignItems="center"
            className={classes.engineOutputExportActions}
            data-veritone-element="export-and-download-action-buttons"
          >
            <Button
              className={classes.actionButton}
              onClick={onCancel}
              data-veritone-element="export-and-download-cancel-button"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.actionButton}
              onClick={this.handleExportAndDownload}
              disabled={disableExportButton}
              data-veritone-element="export-and-download-export-button"
            >
              Export
            </Button>
          </Grid>
        </Grid>
        {isArray(errorSnackBars) && errorSnackBars.map(snackBar => {
          return (
            <Snackbar
              key={`snack-bar-${snackBar.id}`}
              anchorOrigin={snackBar.anchorOrigin}
              open={snackBar.open}
              autoHideDuration={5000}
              // eslint-disable-next-line
              onClose={() => closeSnackBar(snackBar.id)}
              data-veritone-element="export-and-download-snackbar"
            >
              <SnackbarContent
                className={snackBarClasses[snackBar.variant]}
                message={<span id="message-id">{snackBar.message}</span>}
                action={[
                  <IconButton
                    key="close"
                    aria-label="Close"
                    color="inherit"
                    // eslint-disable-next-line
                    onClick={() => closeSnackBar(snackBar.id)}
                    data-veritone-element="export-and-download-snackbar-close-button"
                  >
                    <CloseIcon />
                  </IconButton>
                ]}
              />
            </Snackbar>
          );
        })}
      </Dialog>
    );
  }
}

class EngineOutputExportWidgetComponent extends Component {
  static propTypes = {
    _widgetId: string.isRequired,
    tdos: arrayOf(
      shape({
        tdoId: string.isRequired,
        startOffsetMs: number,
        stopOffsetMs: number
      })
    ).isRequired,
    onExport: func.isRequired,
    onCancel: func
  };

  state = {
    open: false
  };

  open = () => {
    this.setState({
      open: true
    });
  };

  handleCancel = () => {
    this.props.onCancel();
    this.setState({
      open: false
    });
  };

  handleExport = response => {
    this.props.onExport(response);
    this.setState({
      open: false
    });
  };

  render() {
    return (
      <EngineOutputExport
        id={this.props._widgetId}
        open={this.state.open}
        {...this.props}
        onExport={this.handleExport}
        onCancel={this.handleCancel}
      />
    );
  }
}

const EngineOutputExportWidget = widget(EngineOutputExportWidgetComponent);
export { EngineOutputExport as default, EngineOutputExportWidget };
