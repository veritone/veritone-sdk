import React from 'react';
import withMuiThemeProvider from 'helpers/withMuiThemeProvider';
import Button from 'material-ui/Button';
import { func } from 'prop-types';

import NullstateImage from 'resources/images/cms-sources-null.svg';
import styles from './styles.scss';


@withMuiThemeProvider
export default class SourceManagementNullState extends React.Component {
  static propTypes = {
    onClick: func
  };

  static defaultProps = {};

  render() {
    return (
      <div className={styles.nullStateView}>
        {/* <Icon className={'icon-translation'} style={{fontSize: '100px'}}></Icon> USE THIS ICON FOR NOW SINCE IT LOOKS MOST SIMILAR TO DATASETS ICON  */}
        <img
          style={{fontSize: '100px', marginBottom: '30px'}}
          src={NullstateImage}
          alt='https://static.veritone.com/veritone-ui/default-nullstate.svg'
        />
        <div className={styles.titleText}>No Sources</div>
        <div className={styles.greyText}>If you need help getting started, take a look at the</div>
        <div className={styles.linkText}>How to Create a Source</div>
        <Button
          className={styles.buttonStyle}
          raised
          color='primary'
          // component='span'
          onClick={this.props.onClick}>
          Create a Source
        </Button>
      </div>
    )
  }
}