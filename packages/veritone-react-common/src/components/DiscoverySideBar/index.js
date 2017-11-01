import React from 'react';
import { string, func, arrayOf, bool, number, objectOf, element } from 'prop-types';
import IconButton from 'material-ui/IconButton';
import ClearFiltersIconFixme from 'material-ui-icons/FormatClear';
import withMuiThemeProvider from '../../helpers/withMuiThemeProvider';

import styles from './styles/container.scss';
import Header from './header/Header';
import SectionTree, { sectionsShape } from './SectionTree';
import AllFiltersList from './AllFiltersList';

export class DiscoverySideBarContainerPure extends React.Component {
  static propTypes = {
    formComponents: objectOf(element).isRequired,
    sections: sectionsShape.isRequired,
    onClearAllFilters: func,
    onClearFilter: func,
    clearAllFilters: bool,

    // provided by wrapper:
    tabs: arrayOf(string).isRequired,
    selectedTab: string.isRequired,
    onSelectTab: func.isRequired,
    filtersActivePath: arrayOf(number).isRequired,
    onFiltersNavigate: func.isRequired
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
          <div style={{ width: '100%' }}>
            {this.props.filtersActivePath.length === 0 && (
              <AllFiltersList
                onClearAllFilters={this.props.onClearAllFilters}
                onClearFilter={this.props.onClearFilter}
              />
            )}

            <SectionTree
              sections={this.props.sections}
              activePath={this.props.filtersActivePath}
              onNavigate={this.props.onFiltersNavigate}
              formComponents={this.props.formComponents}
            />
          </div>
        )}
        {this.props.selectedTab === 'Browse' && (
          <div data-testtarget="browse" style={{ width: '100%' }}>
            this is browse content
          </div>
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
    selectedTab: this.props.tabs[0],
    filtersActivePath: []
  };

  handleSelectTab = (_, tab) => {
    this.setState({ selectedTab: tab });
  };

  handleFiltersNavigate = newPath => {
    this.setState({ filtersActivePath: newPath });
  };

  render() {
    return (
      <DiscoverySideBarContainerPure
        {...this.props}
        selectedTab={this.state.selectedTab}
        onSelectTab={this.handleSelectTab}
        filtersActivePath={this.state.filtersActivePath}
        onFiltersNavigate={this.handleFiltersNavigate}
      />
    );
  }
}
