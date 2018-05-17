import React from 'react';
import { connect } from 'react-redux';
import { func, arrayOf, string, shape } from 'prop-types';
import { without } from 'lodash';
import { DiscoverySideBar as Sidebar } from 'veritone-react-common';
import { isArray, isString } from 'lodash';

import styles from './styles.scss';

import * as Filters from './Filters';

import * as engineSelectionModule from '../../../../redux/modules/engineSelection';

@connect(
  (state, ownProps) => ({
    filters: engineSelectionModule.getEngineFilters(state)
  }),
  {
    addEngineFilter: engineSelectionModule.addEngineFilter,
    removeEngineFilter: engineSelectionModule.removeEngineFilter,
    clearAllFilters: engineSelectionModule.clearAllFilters
  }
)
export default class EnginesSideBar extends React.Component {
  static propTypes = {
    filters: shape({
      category: arrayOf(string)
    }).isRequired,
    addEngineFilter: func.isRequired,
    removeEngineFilter: func.isRequired,
    clearAllFilters: func.isRequired
  };

  getSelectedFilters = filters => {
    const selectedFilters = [];

    Object.keys(filters).map((filter, i) => {
      if (!filters[filter].length) {
        return;
      }

      if (isArray(filters[filter])) {
        if (filter === 'rating') {
          selectedFilters.push({
            id: JSON.stringify({ filter, value: filters[filter] }),
            label: `Rating: ${filters[filter][0]} & Up`
          });
        } else {
          filters[filter].map(value =>
            selectedFilters.push({
              id: JSON.stringify({ filter, value }),
              label: value
            })
          );
        }
      }

      if (isString(filters[filter])) {
        selectedFilters.push({
          id: JSON.stringify({ filter, value: filters[filter] }),
          label: filters[filter]
        });
      }
    });

    return selectedFilters;
  };

  handleClearFilter = id => {
    const { filter, value } = JSON.parse(id);
    const { filters } = this.props;

    if (!filters[filter].length) {
      return;
    }

    if (isArray(filters[filter])) {
      this.props.addEngineFilter({
        type: filter,
        value: without(filters[filter], value)
      });
    }

    if (isString(filters[filter])) {
      this.props.removeEngineFilter({
        type: filter,
        value
      });
    }
  };

  render() {
    const engineFilters = {
      children: Object.values(Filters).map(({ label, id }) => {
        return {
          label,
          children: [{ formComponentId: id }]
        };
      })
    };

    const formComponents = Object.values(Filters).reduce(
      (acc, { id, component: Component }) => ({
        ...acc,
        [id]: (
          <Component
            filters={this.props.filters}
            filterBy={this.props.addEngineFilter}
          />
        )
      }),
      {}
    );

    return (
      <div className={styles.sideBar}>
        <Sidebar
          tabs={['Filters']}
          clearAllFilters={false}
          onClearFilter={this.handleClearFilter}
          onClearAllFilters={this.props.clearAllFilters}
          filtersSections={engineFilters}
          formComponents={formComponents}
          selectedFilters={this.getSelectedFilters(this.props.filters)}
        />
      </div>
    );
  }
}
