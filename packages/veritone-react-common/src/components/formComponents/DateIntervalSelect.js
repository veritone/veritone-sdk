import React from 'react';
import {
  instanceOf,
  shape,
  bool,
  objectOf,
  oneOfType,
  string
} from 'prop-types';
import { map } from 'lodash';
import { MenuItem } from 'material-ui/es/Menu';
import { ListItem } from 'material-ui/es/List';

import { Interval, defaultIntervals } from 'helpers/date';
import Select from './Select';

const DateIntervalSelect = ({
  intervals,
  allowCustomInterval,
  customIntervalLabel,
  ...props
}) => {
  return (
    <Select {...props}>
      {map(intervals, (interval, id) => (
        <MenuItem value={interval} key={id}>
          {interval.label}
        </MenuItem>
      ))}
      {allowCustomInterval && (
        <ListItem value="custom">{customIntervalLabel}</ListItem>
      )}
    </Select>
  );
};

DateIntervalSelect.defaultProps = {
  intervals: defaultIntervals,
  allowCustomInterval: true,
  customIntervalLabel: 'Custom'
};

DateIntervalSelect.propTypes = {
  input: shape({
    value: oneOfType([instanceOf(Interval), string])
  }),
  intervals: objectOf(instanceOf(Interval)).isRequired,
  allowCustomInterval: bool,
  customIntervalLabel: string
};

export default DateIntervalSelect;
