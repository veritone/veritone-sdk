import React from 'react';
import { bool, string, func, arrayOf, shape } from 'prop-types';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import MaterialRadio from '@material-ui/core/Radio';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import useStyles from './styles.js';


export default function Radio({
  label,
  required,
  name,
  onChange,
  instruction,
  value,
  items,
  error
}) {
  const handleChange = React.useCallback(
    (e) => onChange({ name, value: e.target.value }),
    [name, onChange, value]
  );

  const styles = useStyles({});

  return (
    <FormControl
      error={error.length > 0}
      fullWidth
      className={styles.formItem}
    >
      <Box
        component="fieldset"
        className={styles.box}
      >
        {
          label && <Typography component="legend" variant="caption">
            {label + `${required ? '*' : ''}`}
          </Typography>
        }
        <RadioGroup
          name={name}
          value={value}
          onChange={handleChange}
        >
          {
            items.map((item) => (
              <FormControlLabel
                key={item.id}
                value={item.value}
                control={<MaterialRadio color="primary" />}
                label={item.value} />
            ))
          }
        </RadioGroup>
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

Radio.propTypes = {
  label: string,
  name: string,
  value: string,
  items: arrayOf(shape({
    id: string,
    value: string
  })),
  instruction: string,
  error: string,
  required: bool,
  onChange: func
}

Radio.defaultProps = {
  onChange: () => { },
  items: [],
  error: ''
};
