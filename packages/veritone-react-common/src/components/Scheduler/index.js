import React from 'react';
import { object, func } from 'prop-types';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormLabel, FormControl, FormControlLabel, FormHelperText } from 'material-ui/Form';

export default class Scheduler extends React.Component {
  static propTypes = {
    getSchedule: func,
    schedule: object
  };

  static defaultProps = {
    occurrenceType: 'none'
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
 
  render() {
    return (
      <div>
        <RadioGroup name="occurrenceType" value={this.state.occurrenceType}>
          <FormControlLabel value="recurring" control={<Radio />} label="Recurring" />
          <FormControlLabel value="continuous" control={<Radio />} label="Continuous" />
          <FormControlLabel value="one-time" control={<Radio />} label="One Time" />
          <FormControlLabel value="none" control={<Radio />} label="None" />
        </RadioGroup>
      </div>
    );
  }
}