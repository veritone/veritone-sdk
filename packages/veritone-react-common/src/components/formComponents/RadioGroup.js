import { RadioGroup } from 'material-ui/Radio';
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
      root: styles.container
    }
  })
);
