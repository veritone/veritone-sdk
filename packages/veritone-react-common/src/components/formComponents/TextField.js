import TextField from '@material-ui/core/TextField';
import { createComponent, mapError } from './redux-form-material-ui';

export default createComponent(TextField, ({ defaultValue, ...props }) => ({
  ...mapError(props)
}));
