import React from 'react';
import { func, string } from 'prop-types';

import TextField from '@material-ui/core/TextField';


const TranscriptSearchForm = ({
    defaultValue,
    onChange,
    onKeyPress,
  }) => {
    return (
      <TextField
        id="transcript_search_field"
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
  

  TranscriptSearchForm.propTypes = {
    defaultValue : string,
    onChange: func,
    onKeyPress: func
  }
  
  TranscriptSearchForm.defaultProps = {
    defaultValue: '',
    onChange: () => console.log('onChange event '),
    onKeyPress: () => console.log('onKeyPress event')
  };

  export {
    TranscriptSearchForm
  };
  