import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { bool, func, string, arrayOf, shape, number } from 'prop-types';

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

import styles from './styles.scss';

import * as engineOutputExportModule from '../../redux/modules/engineOutputExport';
import widget from '../../shared/widget';
import EngineCategoryConfigList from './EngineCategoryConfigList';

const snackBarClasses = {
  error: styles.errorSnackBar
};

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
  { withRef: true }
)
class EngineOutputExport extends Component {
  static propTypes = {
    tdos: arrayOf(
      shape({
        tdoId: string,
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
    fetchEngineRunsFailed: bool
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
      fetchEngineRunsFailed
    } = this.props;

    const disableExportButton =
      fetchingEngineRuns ||
      fetchingCategoryExportFormats ||
      fetchEngineRunsFailed;

    return (
      <Dialog fullScreen open={open}>
        <Grid
          container
          direction="column"
          justify="flex-start"
          className={styles.engineOutputExport}
        >
          <Grid item className={styles.engineOutputExportHeader} container>
            <Grid item xs={11}>
              <div className={styles.title}>{`${
                tdos.length > 1 ? 'Bulk ' : ''
              }Export and Download`}</div>
              <div className={styles.subtitle}>
                Select the category, engine, and format type you would like to
                export below based on your selection. Please note that larger
                exports will be available through a download link sent to your
                account email.
              </div>
            </Grid>
            <Grid item xs={1}>
              <IconButton
                className={styles.closeButton}
                color="inherit"
                onClick={onCancel}
                aria-label="Close"
              >
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
          <Grid
            item
            xs
            className={styles.engineOutputExportContent}
            container
            direction="column"
            alignItems="center"
          >
            <Grid item xs={12}>
              <Card className={styles.formatSelection}>
                <CardHeader
                  title="Export Format Selection"
                  subheader="Select from available engine categories and engines that have run on these file(s). Then select your formats you would like to include in your download."
                  classes={{
                    title: styles.exportFormatTitle,
                    subheader: styles.exportFormatSubHeader
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
                    />
                  }
                  subheader="Include the Audio and Video media from your selected file(s) in your export. (This will increase download time)"
                  classes={{
                    title: styles.exportFormatTitle,
                    subheader: styles.exportFormatSubHeader
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
            className={styles.engineOutputExportActions}
          >
            <Button className={styles.actionButton} onClick={onCancel}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={styles.actionButton}
              onClick={this.handleExportAndDownload}
              disabled={disableExportButton}
            >
              Export
            </Button>
          </Grid>
        </Grid>
        {errorSnackBars.map(snackBar => {
          return (
            <Snackbar
              key={`snack-bar-${snackBar.id}`}
              anchorOrigin={snackBar.anchorOrigin}
              open={snackBar.open}
              autoHideDuration={5000}
              // eslint-disable-next-line
              onClose={() => closeSnackBar(snackBar.id)}
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
