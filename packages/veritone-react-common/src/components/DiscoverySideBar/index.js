import React from 'react';
import { string, func, arrayOf, bool } from 'prop-types';
import IconButton from 'material-ui/IconButton';
import ClearFiltersIconFixme from 'material-ui-icons/FormatClear';
import withMuiThemeProvider from '../../helpers/withMuiThemeProvider';
import styles from './styles/container.scss';
import Header from './Header';

// const sectionTree = {
//   'Section 1': {
//     'SubSection 1': {
//       'Sub-SubSection 1': {}
//     }
//   },
//   'Section 2': {},
//   'Section 3': {
//     'SubSection 1': {},
//     'SubSection 2': {}
//   }
// };

export class DiscoverySideBarContainerPure extends React.Component {
  static propTypes = {
    onClearAllFilters: func,
    clearAllFilters: bool,

    // provided by wrapper:
    tabs: arrayOf(string).isRequired,
    selectedTab: string.isRequired,
    onSelectTab: func.isRequired
  };
  static defaultProps = {};

  render() {
    return (
      <div className={styles.container}>
        <Header
          tabs={this.props.tabs}
          selectedTab={this.props.selectedTab}
          rightIconButton={this.props.clearAllFilters}
          rightIconButtonElement={
            <IconButton onClick={this.props.onClearAllFilters}>
              <ClearFiltersIconFixme />
            </IconButton>
          }
          onSelectTab={this.props.onSelectTab}
        />
        {this.props.selectedTab === 'Filters' && (
          <div data-testtarget="filters">this is filters content</div>
        )}
        {this.props.selectedTab === 'Browse' && (
          <div data-testtarget="browse">this is browse content</div>
        )}
      </div>
    );
  }
}

// state provider for top level sidebar state-- selected tabs, sections etc.
@withMuiThemeProvider
export default class DiscoverySideBarContainer extends React.Component {
  static propTypes = {
    tabs: arrayOf(string).isRequired
  };

  static defaultProps = {
    tabs: ['Browse', 'Filters']
  };

  state = {
    selectedTab: this.props.tabs[0]
  };

  handleSelectTab = (_, tab) => {
    this.setState({ selectedTab: tab });
  };

  render() {
    return (
      <DiscoverySideBarContainerPure
        {...this.props}
        selectedTab={this.state.selectedTab}
        onSelectTab={this.handleSelectTab}
      />
    );
  }
}
