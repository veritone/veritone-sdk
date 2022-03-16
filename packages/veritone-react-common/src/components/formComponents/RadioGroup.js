import RadioGroup from '@material-ui/core/RadioGroup';
import { createComponent } from './redux-form-material-ui';

import styles from './styles/radioGroup.scss';

export default createComponent(
  RadioGroup,
  ({
    input: { onChange, value, ...inputProps },
    meta,
    onChange: onChangeFromField,
    classes,
    ...props
  }) => {
    console.log(inputProps);
    console.log(props);
    return {
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
      root: styles.container
    }
  }
})
