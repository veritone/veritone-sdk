import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { FullScreenDialog } from 'veritone-react-common';
import {
  bool,
  func,
  string,
  arrayOf,
  shape,
  number,
  objectOf
} from 'prop-types';

import List from '@material-ui/core/List';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Switch from '@material-ui/core/Switch';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloseIcon from '@material-ui/icons/Close';
import styles from './styles.scss';
import { withMuiThemeProvider } from 'veritone-react-common';

import EngineCategoryConfig from './EngineCategoryConfig';
import * as engineOutputExportModule from '../../redux/modules/engineOutputExport';

@withMuiThemeProvider
@connect(
  state => ({
    includeMedia: engineOutputExportModule.includeMedia(state),
    outputConfigsByCategoryId: engineOutputExportModule.outputConfigsByCategoryId(
      state
    ),
    expandedCategories: engineOutputExportModule.expandedCategories(state),
    fetchingEngineRuns: engineOutputExportModule.fetchingEngineRuns(state)
  }),
  {
    fetchEngineRuns: engineOutputExportModule.fetchEngineRuns,
    setIncludeMedia: engineOutputExportModule.setIncludeMedia,
    toggleConfigExpand: engineOutputExportModule.toggleConfigExpand
  },
  null,
  { withRef: true }
)
export default class EngineOutputExport extends Component {
  static propTypes = {
    tdos: arrayOf(
      shape({
        id: string.isRequired,
        startOffsetMs: number,
        stopOffsetMs: number
      })
    ).isRequired,
    enableBulkExport: bool,
    outputConfigsByCategoryId: objectOf(
      arrayOf(
        shape({
          engineId: string,
          categoryId: string
        })
      )
    ).isRequired,
    expandedCategories: objectOf(bool),
    onCancel: func,
    onExport: func,
    includeMedia: bool,
    setIncludeMedia: func,
    fetchEngineRuns: func,
    fetchingEngineRuns: bool,
    toggleConfigExpand: func
  };

  static state = {
    bulkExportEnabled: false
  };

  static getDerivedStateFromProps(props, state) {
    return {
      bulkExportEnabled: props.enableBulkExport
    };
  }

  componentDidMount() {
    this.props.fetchEngineRuns(this.props.tdos);
  }

  handleIncludeMediaChange = event => {
    this.props.setIncludeMedia(event.target.checked);
  };

  render() {
    const {
      includeMedia,
      outputConfigsByCategoryId,
      onCancel,
      onExport,
      expandedCategories,
      toggleConfigExpand,
      fetchingEngineRuns
    } = this.props;
    const { bulkExportEnabled } = this.state;

    return (
      <FullScreenDialog open>
        <Grid
          container
          direction="column"
          justify="flex-start"
          className={styles.engineOutputExport}
        >
          <Grid item className={styles.engineOutputExportHeader} container>
            <Grid item xs={11}>
              <div className={styles.title}>{`${bulkExportEnabled && "Bulk "}Export and Download`}</div>
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
                {!fetchingEngineRuns ? (
                  <List disablePadding>
                    {Object.keys(outputConfigsByCategoryId).map(
                      (key, index) => (
                        <Fragment key={`engine-output-config-${key}`}>
                          <EngineCategoryConfig
                            categoryId={key}
                            engineCategoryConfigs={
                              outputConfigsByCategoryId[key]
                            }
                            expanded={expandedCategories[key]}
                            bulkExportEnabled={bulkExportEnabled}
                            onExpandConfigs={toggleConfigExpand}
                          />
                          {index !==
                            Object.keys(outputConfigsByCategoryId).length -
                              1 && <Divider />}
                        </Fragment>
                      )
                    )}
                  </List>
                ) : (
                  <div className={styles.loadingConfigsContainer}>
                    <CircularProgress size={50} thickness={2.5} />
                  </div>
                )}
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
              onClick={onExport}
              disabled={fetchingEngineRuns}
            >
              Export
            </Button>
          </Grid>
        </Grid>
      </FullScreenDialog>
    );
  }
}
