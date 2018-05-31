import React from 'react';
import withMuiThemeProvider from 'helpers/withMuiThemeProvider';
import Button from '@material-ui/core/Button';
import { func } from 'prop-types';

import NullstateImage from 'images/cms-sources-null.svg';
import styles from './styles.scss';

@withMuiThemeProvider
export default class SourceManagementNullState extends React.Component {
  static propTypes = {
    onClick: func
  };

  render() {
    return (
      <div className={styles.nullStateView}>
        <img
          style={{ fontSize: '100px', marginBottom: '30px' }}
          src={NullstateImage}
          alt="https://static.veritone.com/veritone-ui/default-nullstate.svg"
        />
        <div className={styles.titleText}>No Sources</div>
        <div className={styles.greyText}>
          If you need help getting started, take a look at the
        </div>
        <div className={styles.linkText}>How to Create a Source</div>
        <Button
          className={styles.buttonStyle}
          variant="raised"
          color="primary"
          onClick={this.props.onClick}
        >
          Create a Source
        </Button>
      </div>
    );
  }
}
