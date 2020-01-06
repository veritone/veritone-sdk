import React from 'react';
import { string, bool, number, func } from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import useStyles from './styles.js';

export default function RatingNumber({
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

  const handleChange = React.useCallback((_, newValue) => {
      onChange({ name, value: newValue })
    },
    [value, onChange],
  )

  const styles = useStyles({});

  return (
    <FormControl
      error={error.length > 0}
      className={styles.formItem}
      fullWidth
    >
      <Box mb={3} borderColor="transparent" className={styles.ratingBox}>
        {
          label && <Typography component="legend">
            {label + `${required ? '*' : ''}`}
          </Typography>
        }
        <Rating
          name={name}
          value={value}
          min={min}
          max={max}
          onChange={handleChange}
        />
      </Box>
      {
        (error || instruction) && (
          <FormHelperText variant="outlined">
            {error || instruction}
          </FormHelperText>
        )
      }
    </FormControl>
  )
}

RatingNumber.propTypes = {
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

RatingNumber.defaultProps = {
  min: 0,
  max: 5,
  error: '',
  value: 0,
  onChange: () => { }
}
