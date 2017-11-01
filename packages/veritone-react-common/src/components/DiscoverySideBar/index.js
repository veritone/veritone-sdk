import React from 'react';
import { string, func, arrayOf, bool, number } from 'prop-types';
import IconButton from 'material-ui/IconButton';
import ClearFiltersIconFixme from 'material-ui-icons/FormatClear';
import withMuiThemeProvider from '../../helpers/withMuiThemeProvider';

import styles from './styles/container.scss';
import Header from './header/Header';
import SectionTree from './SectionTree';
import AllFiltersList from './AllFiltersList';

const fixmeExampleSectionTree = {
  children: [
    {
      label: 'Section 1',
      children: [
        {
          label: 'SubSection 1',
          children: [
            {
              label: 'Sub-SubSection 1',
              children: [{ formComponentId: 'select-station-thing' }]
            }
          ]
        }
      ]
    },
    {
      label: 'Section 2',
      children: []
    },
    {
      label: 'Section 3',
      children: [
        {
          label: 'SubSection 1',
          children: [{ formComponentId: 'select-station-thing' }]
        },
        {
          label: 'SubSection 2',
          children: [{ formComponentId: 'select-station-thing' }]
        }
      ]
    }
  ]
};

// {
//         priceRange: { low: 0, high: 10 }, // one filter
//         stationsOne: ['KCRW', 'KIIS'], // two filters
//         stationsTwo: { values: ['KCRW'], someInternalBooleanOption: false }, // one filter
//         someBoolean: false // one filter
//       }

// labels for each node in the tree (subheader components)
// content (a form component) for each leaf
// values for each leaf (props to the form component)
// number of filters selected at each leaf

export class DiscoverySideBarContainerPure extends React.Component {
  static propTypes = {
    onClearAllFilters: func,
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
            <AllFiltersList onClearAllFilters={this.props.onClearAllFilters} />
            <SectionTree
              sections={fixmeExampleSectionTree}
              activePath={this.props.filtersActivePath}
              onNavigate={this.props.onFiltersNavigate}
              formComponents={{
                'select-station-thing': <div>select a station</div>
              }}
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
