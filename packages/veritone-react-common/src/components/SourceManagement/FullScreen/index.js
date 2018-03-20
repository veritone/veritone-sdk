import React from 'react';

import {
  string,
  bool,
  arrayOf,
  number,
  any,
  objectOf
} from 'prop-types';

import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import Tabs, { Tab } from 'material-ui/Tabs';
import AppBar from 'material-ui/AppBar';

import Assets from './Assets';
import SourceConguration from './SourceConfiguration';
import IngestionJobNullstate from './IngestionJobs/Nullstate';
import AssetsNullstate from './Assets/Nullstate';

import styles from './styles.scss';

export default class SourceManagementFullScreen extends React.Component {
  static propTypes = {
    // data: arrayOf(any).isRequired,
    // sdoSchemaInfo: objectOf(any).isRequired,
    startingTabKey: string,
    startingTabIndex: number,
    tabs: objectOf(string),
    sourceTypes: arrayOf(objectOf(any)).isRequired,
    assets: objectOf(any).isRequired,
    jobInfo: arrayOf(objectOf(any)).isRequired
  };

  static defaultProps = {
    sourceInfo: {
      name: 'Hillary Clinton Twitter'
    },
    tabs: {
      assets: 'Assets',
      ingestionJobs: 'Ingestion Jobs', 
      sourceConfiguration: 'Source Configuration', 
    }
  };

  state = {
    // schemaSelection: this.props.sdoSchemaInfo.schemas[0].schemaName   
    tab: this.props.startingTab || 0 // take key over index in componentWillMount
  };

  componentWillMount = () => {
    if (this.props.startingTabKey) {
      this.setState({
        tab: Object.keys(this.props.tabs).indexOf(this.props.startingTabKey)
      });
    } else if (this.props.startingTab && this.props.startingTab > Object.keys(this.props.tabs).length) {
      this.setState({
        tab: Object.keys(this.props.tabs).length
      });
    }
  }

  handleTabChange = (event, value) => {
    this.setState({tab: value});
  };

  openHelp = () => {
    console.log('trigger help text');
  };

  onClose = () => {
    console.log('trigger close');
  };

  render() {

    const tabs = Object.keys(this.props.tabs).map((tab, index) => {
      return <Tab label={this.props.tabs[tab]} key={index} />
    });
    return (
      <div className={styles.fullPage}>
        <div className={styles.fullScreenTopBar}>
          <div className={styles.topBarTitle}>{this.props.sourceInfo.name}</div>
          <div className={styles.iconGroup}>
            <IconButton className={styles.helpIcon} onClick={this.openHelp} aria-label='help'>
              <Icon className={'icon-help2'}></Icon>
            </IconButton>
            {/* <IconButton className={styles.menuIcon} aria-label='menu'>
              <Icon className={'icon-more_vert'}></Icon>
            </IconButton> */}
            <span className={styles.separator}></span>
            <IconButton className={styles.exitIcon} onClick={this.onClose} aria-label='exit'>
              <Icon className={'icon-close-exit'}></Icon>
            </IconButton>
          </div>
        </div>
        
        <AppBar className={styles.appBarStyle} position='static' color='inherit' elevation={0} >
            <Tabs
              value={this.state.tab}
              onChange={this.handleTabChange}
              indicatorColor='primary'
              textColor='black'
            >
              {tabs}
            </Tabs>
        </AppBar>

        {/* {this.state.tab == 0 && <Assets data={this.props.assets.data} schemas={this.props.assets.schemaInfo} />} */}
        {this.state.tab == 0 && <AssetsNullstate />}
        {(this.state.tab == 1 && this.props.jobInfo.length == 0) && <IngestionJobNullstate />}
        {(this.state.tab == 1 && this.props.jobInfo.length > 0) && <div>JOBS</div>}
        {this.state.tab == 2 && <SourceConguration sourceTypes={this.props.sourceTypes} />}
      </div> 
    );
  };
};