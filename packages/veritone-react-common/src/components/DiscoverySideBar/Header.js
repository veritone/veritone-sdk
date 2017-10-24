import React from 'react';
import Tabs, { Tab } from 'material-ui/Tabs';
import { arrayOf, string, element, func } from 'prop-types';
import withMuiThemeProvider from 'helpers/withMuiThemeProvider';
import styles from './header.scss';

@withMuiThemeProvider
export default class DiscoverySidebarTabbedHeader extends React.Component {
  static propTypes = {
    tabs: arrayOf(string),
    selectedTab: string.isRequired,
    rightIconButton: element,
    onSelectTab: func.isRequired
  };
  static defaultProps = {
    tabs: []
  };

  render() {
    return (
      <div className={styles.container}>
        <Tabs
          value={this.props.selectedTab}
          onChange={this.props.onSelectTab}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          {this.props.tabs.map(t => <Tab value={t} label={t} key={t} />)}
        </Tabs>
        {this.props.rightIconButton && this.props.rightIconButton}
      </div>
    );
  }
}
