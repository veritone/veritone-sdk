import RadioGroup from '@material-ui/core/RadioGroup';
import { withStyles } from 'helpers/withStyles';
import { createComponent } from './redux-form-material-ui';

import styles from './styles/radioGroup';
const classes = withStyles(styles);
const RadioGroupComponent = createComponent(
  RadioGroup,
  ({
    input: { onChange, value, ...inputProps },
    meta,
    onChange: onChangeFromField,
    ...props
  }) => ({
    ...inputProps,
    ...props,
    value,
    onChange: (event, value) => {
      onChange(value);
      if (onChangeFromField) {
        onChangeFromField(value);
      }
    },
    classes: {
      ...classes,
      root: classes.container
    }
  })
);

export default RadioGroupComponent;
