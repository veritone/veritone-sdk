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
import MenuItem from '@material-ui/core/MenuItem';
import ListItem from '@material-ui/core/ListItem';

import { Interval, defaultIntervals } from 'helpers/date';
import Select from './Select';

const DateIntervalSelect = ({
  intervals,
  allowCustomInterval,
  customIntervalLabel,
  ...props
}) => {
  const fixedProps = {
    ...props,
    input: {
      ...props.input,
      value: props.input.value.toString()
    }
  };

  return (
    <Select {...fixedProps}>
      {map(intervals, (interval, id) => (
        <MenuItem value={interval.toString()} key={id}>
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
  intervals: objectOf(instanceOf(Interval)),
  allowCustomInterval: bool,
  customIntervalLabel: string
};

export default DateIntervalSelect;
