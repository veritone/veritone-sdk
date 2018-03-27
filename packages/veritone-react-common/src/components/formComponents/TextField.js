import { LibTextField } from 'redux-form-material-ui';

/* eslint-disable react/prop-types */
const TextField = ({ meta, input, ...props }) => {
  return <LibTextField {...input} {...props} />;
};

export default TextField;
