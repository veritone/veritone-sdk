import React from 'react';
import { func, string } from 'prop-types';
import TextField from '@material-ui/core/TextField';

const OCRForm = ({ 
  onCancel,
  defaultValue,
  onChange,
  onKeyPress,
  inputValue
}) => {
  return (
    <TextField
      id="text_search_field"
      autoFocus
      margin="none"
      defaultValue={defaultValue}
      onChange={onChange}
      onKeyPress={onKeyPress}
      placeholder="Phrase to search"
      fullWidth
    />
  );
};


  OCRForm.propTypes = {
    onCancel: func,
    defaultValue : string,
    onChange: func,
    onKeyPress: func,
    inputValue: string
  }
  
  OCRForm.defaultProps = {
    onCancel: () => console.log('onCancel event '),
    defaultValue: '',
    onChange: () => console.log('onChange event '),
    onKeyPress: () => console.log('onKeyPress event')
  };


  export {
    OCRForm
  };