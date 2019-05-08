import React from 'react';
import { connect } from 'react-redux';
import { guid } from '../../shared/util';

import { any, bool, func, objectOf } from 'prop-types';

import * as multipleEngineSelectionModule from '../../redux/modules/multipleEngineSelection';

import widget from '../../shared/widget';
import EnginePicker from '.';
import SelectionInfoPanel from './SelectionInfoPanel';

@connect(
  (state, { ids }) => {
    return {
      selected: multipleEngineSelectionModule.selectedEngines(state, ids),
      canSelectMore: multipleEngineSelectionModule.canSelectMore(state)
    };
  },
  {
    toggleSelection: multipleEngineSelectionModule.toggleEngine
  }
)
class MultipleEnginePicker extends React.Component {
  static propTypes = {
    canSelectMore: bool,
    selected: objectOf(any),
    toggleSelection: func
  };

  constructor(props) {
    super(props);

    this.id = guid();
    this.id2 = guid();
  }

  state = {
    baselineEngineId: undefined
  };

  selectBaseline = id => {
    this.setState({
      baselineEngineId: id
    });
  };

  render() {
    return (
      <div
        style={{
          width: '100%',
          flexDirection: 'column'
        }}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            minHeight: '650px',
            padding: '1em'
          }}
        >
          <div style={{ display: 'flex', flexGrow: '1' }}>
            <div
              style={{
                width: '50%',
                height: '100%',
                marginRight: '1em',
                display: 'block'
              }}
            >
              <EnginePicker
                maxSelections={6}
                toggleGlobally
                toggleSelection={this.toggleSelection}
                selected={this.props.selected}
                canSelectMore={this.props.canSelectMore}
                id={this.id}
                title="My Engines"
                onlyShowMyEngines
              />
            </div>

            <div
              style={{
                width: '50%',
                height: '100%',
                marginLeft: '1em',
                display: 'block'
              }}
            >
              <EnginePicker
                maxSelections={6}
                toggleGlobally
                toggleSelection={this.toggleSelection}
                selected={this.props.selected}
                canSelectMore={this.props.canSelectMore}
                id={this.id2}
              />
            </div>
          </div>
        </div>

        <div
          style={{
            width: '100%',
            padding: '1em',
            minHeight: '300px',
            height: '100%',
            display: 'block'
          }}
        >
          <SelectionInfoPanel
            selectSpecial={this.selectBaseline}
            selectSpecialId={this.state.baselineEngineId}
            toggleEngine={this.props.toggleSelection}
          />
        </div>
      </div>
    );
  }
}

const MultipleEnginePickerWidget = widget(MultipleEnginePicker);
export { MultipleEnginePicker as default, MultipleEnginePickerWidget };
