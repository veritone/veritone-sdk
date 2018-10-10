import React from 'react';
import { func, string } from 'prop-types';

import TextField from '@material-ui/core/TextField';


const SentimentSearchForm = ({
    onCancel,
    defaultValue,
    onChange,
    onKeyPress,
    inputValue
  }) => {
    return (
      <TextField
        id="sentiment_search_field"
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
  

  SentimentSearchForm.propTypes = {
    onCancel: func,
    defaultValue : string,
    onChange: func,
    onKeyPress: func,
    inputValue: string
  }
  
  SentimentSearchForm.defaultProps = {
    onCancel: () => console.log('onCancel event '),
    defaultValue: '',
    onChange: () => console.log('onChange event '),
    onKeyPress: () => console.log('onKeyPress event')
  };

  export {
    SentimentSearchForm
  };
  