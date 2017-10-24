import React from 'react';
import { string, func, arrayOf } from 'prop-types';
import IconButton from 'material-ui/IconButton';
import ClearFiltersIconFixme from 'material-ui-icons/FormatClear';
import Header from './Header';
import styles from './container.scss';

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

// fixme: can i have subsections or inputs in a given view, but not both?

export class DiscoverySideBarContainerPure extends React.Component {
  static propTypes = {
    onClearAllFilters: func,

    // provided by wrapper:
    tabs: arrayOf(string),
    activeTab: string.isRequired,
    onSelectTab: func.isRequired
  };
  static defaultProps = {};

  render() {
    return (
      <div className={styles.container}>
        <Header
          tabs={this.props.tabs}
          selectedTab={this.props.activeTab}
          rightIconButton
          rightIconButtonElement={
            <IconButton>
              <ClearFiltersIconFixme />
            </IconButton>
          }
          onClear={this.props.onClearAllFilters}
          onSelectTab={this.props.onSelectTab}
        />
        {
          this.props.activeTab === 'Filters' &&
          <div>this is filters content</div>
        }
        {
          this.props.activeTab === 'Browse' &&
          <div>this is browse content</div>
        }
      </div>
    );
  }
}

// state provider for top level sidebar state-- selected tabs, sections etc.
export default class DiscoverySideBarContainer extends React.Component {
  static propTypes = {
    tabs: arrayOf(string)
  };

  static defaultProps = {
    tabs: ['Browse', 'Filters']
  };

  state = {
    activeTab: this.props.tabs[0]
  };

  handleSelectTab = (_, tab) => {
    this.setState({ activeTab: tab });
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
