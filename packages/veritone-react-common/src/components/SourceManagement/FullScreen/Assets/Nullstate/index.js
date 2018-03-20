import React from 'react';

import {
  string
} from 'prop-types';
import withMuiThemeProvider from 'helpers/withMuiThemeProvider';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';

import NullstateImage from 'resources/images/cms-source-detail-assets-null.svg';
import styles from './styles.scss';

@withMuiThemeProvider
export default class IngestionJobNullstate extends React.Component {
  static propTypes = {
    
  };

  static defaultProps = {};

  state = {

  };

  render() {
    return (
      <div className={styles.nullStateView}>
        {/* <Icon className={'icon-translation'} style={{fontSize: '100px'}}></Icon> USE THIS ICON FOR NOW SINCE IT LOOKS MOST SIMILAR TO DATASETS ICON  */}
        <img style={{fontSize: '100px', marginBottom: '30px'}} src={NullstateImage} alt='https://static.veritone.com/veritone-ui/default-nullstate.svg'/>
        <div className={styles.titleText}>No Associated Assets</div>
        <div className={styles.greyText}>If you need help getting started, take a look at the</div>
        <div className={styles.linkText}>How to Ingest a Data Set</div>
        <Button className={styles.buttonStyle} raised color='primary' component='span'>
          Ingest Data
        </Button>
      </div>
    );
  };
}