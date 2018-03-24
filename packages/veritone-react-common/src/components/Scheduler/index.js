import React from 'react';
import { object, func } from 'prop-types';
import Radio, { RadioGroup } from 'material-ui/Radio';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import { FormLabel, FormControl, FormControlLabel, FormHelperText } from 'material-ui/Form';
import { get } from 'lodash';

const RECURRING_SELECTION = {
  label: 'Recurring',
  value: 'recurring'
};
const CONTINUOUS_SELECTION = {
  label: 'Continuous',
  value: 'continuous'
};
const ONE_TIME_SELECTION = {
  label: 'Immediate',
  value: 'immediate'
};
const NONE_SELECTION = {
  label: 'On Demand',
  value: 'on-demand'
};
const HOUR_SELECTION = {
  label: 'hour',
  value: 'hour'
};
const DAY_SELECTION = {
  label: 'day',
  value: 'day'
};
const WEEK_SELECTION = {
  label: 'week',
  value: 'week'
};
const REPEAT_HOUR_VALUES = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
const REPEAT_DAY_VALUES = [1,2,3,4,5,6];
const REPEAT_WEEK_VALUES = [1,2,3];

const OCCURENCE_TYPE_SELECTIONS = [
  RECURRING_SELECTION,
  CONTINUOUS_SELECTION,
  ONE_TIME_SELECTION,
  NONE_SELECTION
].map(selection => 
  <FormControlLabel value={selection.value} control={<Radio />} label={selection.label} />
);
const REPEAT_TYPE_SELECTIONS = [
  HOUR_SELECTION,
  DAY_SELECTION,
  WEEK_SELECTION
].map(selection =>
  <MenuItem key={selection.value} value={selection.value}>{selection.label}</MenuItem>
);
const REPEAT_HOUR_SELECTIONS = REPEAT_HOUR_VALUES.map(selection => 
  <MenuItem key={selection} value={selection}>{selection}</MenuItem>
);
const REPEAT_DAY_SELECTIONS = REPEAT_DAY_VALUES.map(selection => 
  <MenuItem key={selection} value={selection}>{selection}</MenuItem>
);
const REPEAT_WEEK_SELECTIONS = REPEAT_WEEK_VALUES.map(selection => 
  <MenuItem key={selection} value={selection}>{selection}</MenuItem>
);

export default class Scheduler extends React.Component {
  static propTypes = {
    updateSchedule: func.isRequired,
    schedule: object
  };

  componentDidMount() {
  }

  // Hydrate the adapter with the provided schedule if it is defined
  state = {
    occurrenceType: get(this.props, ['schedule', 'occurrenceType']) || NONE_SELECTION.value,
    repeatType: get(this.props, ['schedule', 'repeatType']) || HOUR_SELECTION.value,
    repeatValue: get(this.props, ['schedule', 'repeatValue']) || REPEAT_HOUR_VALUES[0],
    startDateTime: get(this.props, ['schedule', 'startDateTime']) || new Date(),
    stopDateTime: get(this.props, ['schedule', 'stopDateTime'])
  }

  // Component specific functions here
  getRepeatValueSelector = () => {
    let childrenSelection = [];
    switch (this.state.repeatType) {
      case HOUR_SELECTION.value:
        childrenSelection = REPEAT_HOUR_SELECTIONS;
        break;
      case DAY_SELECTION.value:
        childrenSelection = REPEAT_DAY_SELECTIONS;
        break;
      case WEEK_SELECTION.value:
        childrenSelection = REPEAT_WEEK_SELECTIONS;
        break;
    }
    return (
      <Select
        value={this.state.repeatValue}
        onChange={this.handleRepeatValueChange}
        children={childrenSelection}>
      </Select>
    );
  }

  sendSchedule = () => {
    this.props.updateSchedule(this.state);
  }

  handleOccurenceTypeChange = (event, value) => {
    this.setState(Object.assign({}, this.state, { occurrenceType: value }), this.sendSchedule);
  }

  handleEndsChange = event => {
    this.setState(Object.assign({}, this.state, { ends: event.target.value }), this.sendSchedule);
  }

  handleRepeatTypeChange = event => {
    this.setState(Object.assign({}, this.state, { repeatType: event.target.value }), this.sendSchedule);
  }

  handleRepeatValueChange = event => {
    this.setState(Object.assign({}, this.state, { repeatValue: event.target.value }), this.sendSchedule);
  }

  render() {
    let ends = this.state.ends;
    let repeatType = this.state.repeatType;
    let occurrenceType = this.state.occurrenceType;
    let dynamicSection = [];
    if (occurrenceType === RECURRING_SELECTION.value) {
      dynamicSection.push(
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <div>Repeat every</div>
          <div style={{display: 'flex', flexDirection: 'row'}}>
            <div>
              {this.getRepeatValueSelector()}
            </div>
            <div>
              <Select
                value={repeatType}
                onChange={this.handleRepeatTypeChange}
                children={REPEAT_TYPE_SELECTIONS}>
              </Select>
            </div>
          </div>
        </div>
      );
    }
    if (occurrenceType === RECURRING_SELECTION.value || occurrenceType === CONTINUOUS_SELECTION.value) {
      dynamicSection.push(
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <div>Starts</div>
          <div style={{display: 'flex', flexDirection: 'row'}}>
            Start DateTime Picker
          </div>
        </div>
      );
      if (repeatType === DAY_SELECTION.value) {
        dynamicSection.push(
          <div>
            <div style={{display: 'flex', flexDirection: 'row'}}>
              <div>Day Section</div>
              <div>
                Day Interval DateTime Pickers
              </div>
            </div>
          </div>
        );
      }
      if (repeatType === WEEK_SELECTION.value) {
        dynamicSection.push(
          <div>
            <div style={{display: 'flex', flexDirection: 'row'}}>
              <div></div>
              <div>
                REPEATORS FOR {WEEK_SELECTION.value}
              </div>
            </div>
          </div>
        );
      }
      dynamicSection.push(
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <div>Ends</div>
          <div style={{display: 'flex', flexDirection: 'row'}}>
            End DateTime Picker
          </div>
        </div>
      );
    }
    return (
      <div>
        <FormControl component="fieldset" required>
          <RadioGroup 
            name="occurrenceType"
            value={occurrenceType}
            onChange={this.handleOccurenceTypeChange}
            style={{display: 'flex', flexDirection: 'row'}}
            children={OCCURENCE_TYPE_SELECTIONS}>
          </RadioGroup>
          {dynamicSection}
        </FormControl>
      </div>
    );
  }
}