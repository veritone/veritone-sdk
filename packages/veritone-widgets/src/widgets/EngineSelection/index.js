import React from 'react';
import { bool, func } from 'prop-types';
import { connect } from 'react-redux';

import { DiscoverySideBar as Sidebar } from 'veritone-react-common';

import Tabs from './Tabs';
import SelectBar from './SelectBar';
import EngineSelectionRow from './EngineSelectionRow';

import widget from '../../shared/widget';

import styles from './styles.scss';



const exampleSectionTree = {
  children: [
    {
      label: 'Classes',
      children: [
        {
          label: 'SubSection 1',
          children: [{ formComponentId: 'select-station-form' }]
        }
      ]
    },
    {
      label: 'Price & Rating',
      children: [{
        label: 'SubSection 1',
        children: [{ formComponentId: 'select-station-form' }]
      }]
    },
    {
      label: 'Deployment Model',
      children: [
        {
          label: 'SubSection 1',
          children: [{ formComponentId: 'select-station-form' }]
        },
        {
          label: 'SubSection 2',
          children: [{ formComponentId: 'select-station-form' }]
        }
      ]
    },
    {
      label: 'Attributes',
      children: [
        {
          label: 'SubSection 1',
          children: [{ formComponentId: 'select-station-form' }]
        },
        {
          label: 'SubSection 2',
          children: [{ formComponentId: 'select-station-form' }]
        }
      ]
    }
  ]
};

const exampleSelectedFilters = [
  {
    label: 'filter category one',
    number: 5,
    id: '1'
  },
  {
    label: 'filter category 2',
    number: 10,
    id: '2'
  }
];

@connect(
  state => ({
    open: null
  }),
  { },
)
class EngineSelectionWidget extends React.Component {
  static propTypes = {};

  render() {    
    return (
      <div>
        <div className={styles.engineSelection}>
          <div style={{ minWidth: '290px', maxWidth: '290px' }}>
            <Sidebar
              tabs={['Filters']}
              clearAllFilters={false}
              filtersSections={exampleSectionTree}
              formComponents={{
                'select-station-form': <div>select a station</div>
              }}
            />
          </div>
          <div>
            <Tabs />
            <div style={{ padding: '0 20px' }}>
              <SelectBar />
              {Array(10).fill(0).map(() => {
                return <EngineSelectionRow />;
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default widget(EngineSelectionWidget);
