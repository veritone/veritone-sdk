import React from 'react';
import { string, func } from 'prop-types';
import IconButton from 'material-ui/IconButton';
import ClearFiltersIconFixme from 'material-ui-icons/FormatClear';
import Header from './Header';
import styles from './container.scss';

const tabs = ['Filters', 'Browse'];

export class DiscoverySideBarContainerPure extends React.Component {
  static propTypes = {
    onClearAllFilters: func,

    // provided by wrapper:
    activeTab: string.isRequired,
    onSelectTab: func.isRequired,
  };
  static defaultProps = {};

  render() {
    return (
      <div className={styles.container}>
        <Header
          tabs={tabs}
          selectedTab={this.props.activeTab}
          rightIconButton={
            <IconButton>
              <ClearFiltersIconFixme />
            </IconButton>
          }
          onClear={this.props.onClearAllFilters}
          onSelectTab={this.props.onSelectTab}
        />
      </div>
    );
  }
}

// state provider for top level sidebar state-- selected tabs, sections etc.
export default class DiscoverySideBarContainer extends React.Component {
  state = {
    activeTab: tabs[0]
  };

  handleSelectTab = (_, tab) => {
    this.setState({ activeTab: tab })
  };

  render() {
    return (
      <DiscoverySideBarContainerPure
        {...this.props}
        activeTab={this.state.activeTab}
        onSelectTab={this.handleSelectTab}
      />
    );
  }
}
