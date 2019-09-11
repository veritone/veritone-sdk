import React from 'react';
import { bool, string, func, arrayOf, shape } from 'prop-types';
import FormGroup from '@material-ui/core/FormGroup';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import _ from 'lodash';
import styles from './styles.scss';

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
  const handleChange = React.useCallback((e) => {
    const isItemChecked = _.includes(value, e.target.value);
    if (isItemChecked) {
      onChange({
        name,
        value: _.filter(value, itemValue => itemValue !== e.target.value)
      });
    } else {
      onChange({ name, value: [...value, e.target.value] });
    }
  }, [name, value, onChange])

  return (
    <FormControl error={error.length > 0} fullWidth>
      <Box
        component="fieldset"
        className={styles.box}
        // borderRadius={5}
        // width="100%"
        // borderColor="rgba(0, 0, 0, 0.23)"
      >
        <Typography component="legend">
          {`${label || name}` + `${required ? ' *' : ''}`}
        </Typography>
        <FormGroup>
          {items.map(item => {
            return (
              <FormControlLabel
                key={item.id}
                className="item-checkbox"
                control={
                  <Checkbox
                    value={item.value}
                    checked={_.includes(value, item.value)}
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label={item.value}
              />
            );
          })}
        </FormGroup>
      </Box>
      <FormHelperText variant="outlined">
        {error || instruction}
      </FormHelperText>
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
  onChange: () => {},
  error: ''
};
