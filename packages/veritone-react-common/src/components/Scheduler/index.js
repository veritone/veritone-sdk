import React from 'react';
import { object, func } from 'prop-types';
import Radio, { RadioGroup } from 'material-ui/Radio';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import { FormLabel, FormControl, FormControlLabel, FormHelperText } from 'material-ui/Form';

const RECURRING_SELECTION = {
  label: 'Recurring',
  value: 'recurring'
};
const CONTINUOUS_SELECTION = {
  label: 'Continuous',
  value: 'continuous'
};
const ONE_TIME_SELECTION = {
  label: 'One Time',
  value: 'one-time'
};
const NONE_SELECTION = {
  label: 'None',
  value: 'none'
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
const RETAIN_DATA_VALUES = [1,2,3,4,5,6,7];
const ENDS_VALUES = [1,2,3,4,5,6,7]; 
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
const RETAIN_DATA_SELECTIONS = RETAIN_DATA_VALUES.map(selection => 
  <MenuItem key={selection} value={selection}>{selection} Days</MenuItem>
);
const ENDS_SELECTION = ENDS_VALUES.map(selection => 
  <MenuItem key={selection} value={selection}>{selection} Days</MenuItem>
);

export default class Scheduler extends React.Component {
  static propTypes = {
    getSchedule: func,
    schedule: object
  };

  static defaultProps = {
    schedule: {
      occurrenceType: NONE_SELECTION.value,
      repeatType: HOUR_SELECTION.value,
      repeatValue: REPEAT_HOUR_VALUES[0],
      ends: ENDS_VALUES[6],
      retainData: RETAIN_DATA_VALUES[6],
    }
  };

  componentDidMount() {
    // Required function to get schedule set by user
    if (typeof this.props.getSchedule === 'function') {
      // Return the current schedule
      this.props.getSchedule(() => this.state.schedule);
    } else {
      console.error('Missing required getSchedule function');
    }
  }

  // Hydrate the adapter with the provided schedule if it is defined
  state = {
    schedule: this.props.schedule || {}
  };

  // Component specific functions here
  getRepeatValueSelector = () => {
    let childrenSelection = [];
    switch (this.state.schedule.repeatType) {
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
        value={this.state.schedule.repeatValue}
        onChange={this.handleRepeatValueChange}
        children={childrenSelection}>
      </Select>
    );
  }

  handleOccurenceTypeChange = (event, value) => {
    this.setState({ schedule: Object.assign({}, this.state.schedule, { occurrenceType: value }) });
  }

  handleRetainDataChange = event => {
    this.setState({ schedule: Object.assign({}, this.state.schedule, { retainData: event.target.value }) });
  }

  handleEndsChange = event => {
    this.setState({ schedule: Object.assign({}, this.state.schedule, { ends: event.target.value }) });
  }

  handleRepeatTypeChange = event => {
    this.setState({ schedule: Object.assign({}, this.state.schedule, { repeatType: event.target.value }) });
  }

  handleRepeatValueChange = event => {
    this.setState({ schedule: Object.assign({}, this.state.schedule, { repeatValue: event.target.value }) });
  }

  render() {
    let retainData = this.state.schedule.retainData;
    let ends = this.state.schedule.ends;
    let repeatType = this.state.schedule.repeatType;
    let occurrenceType = this.state.schedule.occurrenceType;
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
      if (repeatType === DAY_SELECTION.value || repeatType === WEEK_SELECTION.value) {
        dynamicSection.push(
          <div>
            <div style={{display: 'flex', flexDirection: 'row'}}>
              <div>Time Zone</div>
              <div>
                TIMEZONE SELECTOR
              </div>
            </div>
            <div style={{display: 'flex', flexDirection: 'row'}}>
              <div></div>
              <div>
                REPEATORS FOR {repeatType}
              </div>
            </div>
          </div>
        );
      }
    }
    if (occurrenceType === RECURRING_SELECTION.value || occurrenceType === CONTINUOUS_SELECTION.value) {
      dynamicSection.push(
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <div>Ends</div>
          <div>
            <Select
              value={ends}
              onChange={this.handleEndsChange}
              children={ENDS_SELECTION}>
            </Select>
          </div>
        </div>
      );
    }
    if (occurrenceType !== 'none') {
      dynamicSection.push(
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <div>Retain data for</div>
          <div>
            <Select
              value={retainData}
              onChange={this.handleRetainDataChange}
              children={RETAIN_DATA_SELECTIONS}>
            </Select>
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