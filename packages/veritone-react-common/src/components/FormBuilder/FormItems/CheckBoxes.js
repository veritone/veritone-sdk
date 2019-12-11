import React from 'react';
import { bool, string, func, arrayOf, shape } from 'prop-types';
import FormGroup from '@material-ui/core/FormGroup';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import useStyles from './styles.js';

export default function Checkboxes({
  label,
  required,
  name,
  onChange,
  instruction,
  value,
  items,
  error
}) {
  const styles = useStyles({});

  const handleChange = React.useCallback((e) => {
    const isItemChecked = value.includes(e.target.value);
    if (isItemChecked) {
      onChange({
        name,
        value: value.filter(itemValue => itemValue !== e.target.value)
      });
    } else {
      onChange({ name, value: [...value, e.target.value] });
    }
  }, [name, value, onChange])

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
        <FormGroup>
          {items.map(item => {
            return (
              <FormControlLabel
                key={item.id}
                className={styles.itemCheckbox}
                control={
                  <Checkbox
                    value={item.value}
                    checked={value.includes(item.value)}
                    onChange={handleChange}
                    color="primary"
                    name={name}
                  />
                }
                label={item.value}
              />
            );
          })}
        </FormGroup>
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

Checkboxes.propTypes = {
  label: string,
  name: string,
  required: bool,
  instruction: string,
  value: arrayOf(string),
  onChange: func,
  items: arrayOf(shape({
    id: string,
    value: string
  })),
  error: string
}

Checkboxes.defaultProps = {
  value: [],
  items: [],
  onChange: () => { },
  error: ''
};
