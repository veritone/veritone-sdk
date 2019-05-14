import React from 'react';
import { connect } from 'react-redux';
import { guid } from '../../shared/util';

import { any, bool, func, objectOf, number } from 'prop-types';

import * as multipleEngineSelectionModule from '../../redux/modules/multipleEngineSelection';

import widget from '../../shared/widget';
import EnginePicker from '.';
import SelectionInfoPanel from './SelectionInfoPanel';

@connect(
  (state, { ids }) => {
    return {
      selectedEngines: multipleEngineSelectionModule.selectedEngines(state, ids),
      canSelectMoreEngines: multipleEngineSelectionModule.canSelectMore(state)
    };
  },
  {
    toggleEngineSelection: multipleEngineSelectionModule.toggleEngine
  }
)
class MultipleEnginePicker extends React.Component {
  static propTypes = {
    canSelectMoreEngines: bool,
    selectedEngines: objectOf(any),
    toggleEngineSelection: func,
    maxSelectedEngines: number
  };

  static defaultProps = {
    maxSelectedEngines: 6
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

  removeSelectedEngine = id => {
    this.props.toggleEngineSelection(id);
    if(this.state.baselineEngineId === id) {
      this.setState({
        baselineEngineId: undefined
      });
    }
  }

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
                maxSelections={this.props.maxSelectedEngines}
                toggleGlobally
                toggleSelection={this.props.toggleEngineSelection}
                selected={this.props.selectedEngines}
                canSelectMore={this.props.canSelectMoreEngines}
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
                maxSelections={this.props.maxSelectedEngines}
                toggleGlobally
                toggleSelection={this.props.toggleEngineSelection}
                selected={this.props.selectedEngines}
                canSelectMore={this.props.canSelectMoreEngines}
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
            maxSelections={this.props.maxSelectedEngines}
            selectBaseline={this.selectBaseline}
            baselineEngineId={this.state.baselineEngineId}
            toggleEngineSelection={this.removeSelectedEngine}
          />
        </div>
      </div>
    );
  }
}

const MultipleEnginePickerWidget = widget(MultipleEnginePicker);
export { MultipleEnginePicker as default, MultipleEnginePickerWidget };
