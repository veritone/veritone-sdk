import Select from '@material-ui/core/Select';
import { createComponent, mapError } from './redux-form-material-ui';

export default createComponent(
  Select,
  ({
    input: { onChange, value, onBlur, ...inputProps },
    onChange: onChangeFromField,
    defaultValue,
    ...props
  }) => ({
    ...mapError(props),
    ...inputProps,
    value: value,
    onChange: event => {
      onChange(event.target.value);
      if (onChangeFromField) {
        onChangeFromField(event.target.value);
      }
    },
    onBlur: () => onBlur(value)
  })
);
