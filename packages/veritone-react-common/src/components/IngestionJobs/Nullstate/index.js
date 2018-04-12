import React from 'react';

import withMuiThemeProvider from 'helpers/withMuiThemeProvider';
import Button from 'material-ui/Button';

import NullstateImage from 'images/cms-ingestion-jobs-null.svg';
import styles from './styles.scss';

@withMuiThemeProvider
export default class IngestionJobNullstate extends React.Component {
  render() {
    return (
      <div className={styles.nullStateView}>
        <img
          style={{ fontSize: '100px', marginBottom: '30px' }}
          src={NullstateImage}
          alt="https://static.veritone.com/veritone-ui/default-nullstate.svg"
        />
        <div className={styles.titleText}>No Ingestion Jobs</div>
        <div className={styles.greyText}>
          If you need help getting started, take a look at the
        </div>
        <div className={styles.linkText}>How to Ingest a Data Set</div>
        <Button
          className={styles.buttonStyle}
          variant="raised"
          color="primary"
          component="span"
        >
          New Ingestion Job
        </Button>
      </div>
    );
  }
}
