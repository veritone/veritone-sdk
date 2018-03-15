import React from 'react';
import {
  string,
  func,
  arrayOf,
  bool,
  number,
  objectOf,
  element,
  object
} from 'prop-types';
import IconButton from 'material-ui/IconButton';
import ClearFiltersIconFixme from 'material-ui-icons/FormatClear';
import withMuiThemeProvider from '../../helpers/withMuiThemeProvider';

import styles from './styles/container.scss';
import Header from './header/Header';
import SectionTree, { sectionsShape } from './SectionTree';
import AllFiltersList from './AllFiltersList';

// todo:
// figure out how state will come from redux-form and how to transform that
// into filters counts for each section/subsection

// figure out how callbacks from clear-filters at various levels will clear
// the associated redux-form state (by <Field> name/id?)

// animations

export { sectionsShape } from './SectionTree';

export class DiscoverySideBarContainerPure extends React.Component {
  static propTypes = {
    formComponents: objectOf(element),
    filtersSections: sectionsShape.isRequired,
    selectedFilters: arrayOf(object).isRequired, // see AllFiltersList.filters
    onClearAllFilters: func,
    onClearFilter: func,
    clearAllFilters: bool,

    // provided by wrapper:
    tabs: arrayOf(string).isRequired,
    selectedTab: string.isRequired,
    onSelectTab: func.isRequired,
    filtersActivePath: arrayOf(number).isRequired,
    onFiltersNavigate: func.isRequired,
    noTabs: bool    
  };
  static defaultProps = {
    selectedFilters: []
  };

  render() {
    if (this.props.noTabs) {
      return (
        <div className={styles.container}>
          <SectionTree
            sections = {this.props.filtersSections}
            activePath = {this.props.filtersActivePath}
            onNavigate = {this.props.onFiltersNavigate}
            formComponents = {this.props.formComponents}
            iconStyle={this.props.iconStyle}
            selectedFilterStyle={this.props.selectedFilterStyle}
          />
        </div>
      );
    }

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
            {this.props.filtersActivePath.length === 0 &&
              this.props.selectedFilters.length > 0 && (
                <AllFiltersList
                  filters={this.props.selectedFilters} // fixme
                  onClearAllFilters={this.props.onClearAllFilters}
                  onClearFilter={this.props.onClearFilter}
                />
              )}

            <SectionTree
              // todo: add filters
              sections={this.props.filtersSections}
              activePath={this.props.filtersActivePath}
              onNavigate={this.props.onFiltersNavigate}
              formComponents={this.props.formComponents}
              iconStyle={this.props.iconStyle}
              selectedFilterStyle={this.props.selectedFilterStyle}
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
    tabs: arrayOf(string),
    noTabs: bool
  };

  static defaultProps = {
    tabs: ['Browse', 'Filters'],
    noTabs: false
  };

  state = {
    selectedTab: !this.props.noTabs ? this.props.tabs[0] : '',
    filtersActivePath: []
  };

  handleSelectTab = (_, tab) => {
    this.setState({ selectedTab: tab });
  };

  handleFiltersNavigate = newPath => {
    this.setState({ filtersActivePath: newPath });
  };

  render() {
    const { filtersActivePath, onFiltersNavigate, ...rest } = this.props;

    return (
      <DiscoverySideBarContainerPure
        selectedTab={this.state.selectedTab}
        onSelectTab={this.handleSelectTab}
        filtersActivePath={this.props.filtersActivePath || this.state.filtersActivePath}
        onFiltersNavigate={onFiltersNavigate || this.handleFiltersNavigate}
        {...rest}
      />
    );
  }
}
