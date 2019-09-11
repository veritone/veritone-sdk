import React from 'react';
import { string, bool, number, func } from 'prop-types';
import Typography from '@material-ui/core/Typography';
import MuiRating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';


export default function Rating({
  label,
  required,
  name,
  onChange,
  instruction,
  min,
  max,
  value,
  error
}) {
  const handleChange = React.useCallback(
    (e) => onChange({ name, value: parseInt(e.target.value, 10)}),
    [name, onChange]
  );

  return (
    <FormControl error={error.length > 0}>
      <Box mb={3} borderColor="transparent">
        <Typography component="legend">
          {`${label || name}` + `${required ? ' *': ''}`}
        </Typography>
        <MuiRating
          name={name}
          value={value}
          min={min}
          max={max}
          onChange={handleChange}
        />
      </Box>
      <FormHelperText variant="outlined">{error || instruction}</FormHelperText>
    </FormControl>
  )
}

Rating.propTypes = {
  instruction: string,
  error: string,
  min: number,
  max: number,
  value: number,
  required: bool,
  label: string,
  name: string,
  onChange: func
}

Rating.defaultProps = {
  min: 0,
  max: 5,
  onChange: () => {},
  error: ''
}