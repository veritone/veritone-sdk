import React from 'react';
import { RadioGroup as LibRadioGroup } from 'redux-form-material-ui';

import styles from './styles/radioGroup.scss';

const RadioGroup = props => (
  <LibRadioGroup
    classes={{
      root: styles.container
    }}
    {...props}
  />
);

export default RadioGroup;
