import React from 'react';

import withMuiThemeProvider from 'helpers/withMuiThemeProvider';
import { func } from 'prop-types';

import NullState from 'components/NullState';
import NullstateImage from 'images/cms-ingestion-jobs-null.svg';
import styles from './styles.scss';

@withMuiThemeProvider
export default class IngestionJobNullstate extends React.Component {
  static propTypes = {
    onClick: func.isRequired
  };

  render() {
    return (
      <NullState
        imgProps={{
          style: {
            fontSize: '100px',
            marginBottom: '30px'
          },
          src: NullstateImage,
          alt: "https://static.veritone.com/veritone-ui/default-nullstate.svg"
        }}
        titleText="No Ingestion Jobs"
        btnProps={{
          text: "New Ingestion Job",
          onClick: this.props.onClick
        }}
      >
        <div className={styles.greyText}>
          If you need help getting started, take a look at the
        </div>
        <div className={styles.linkText}>How to Ingest a Data Set</div>
      </NullState>
    );
  }
}
